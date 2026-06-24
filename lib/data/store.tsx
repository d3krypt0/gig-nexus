"use client";

// Single client-side store for the whole app: applications + activity feed,
// persisted to localStorage so quick-apply / drag-status / mark-followed-up
// actually stick across navigation. ponytail: localStorage is the lazy-correct
// "database" for a personal single-user tool — swap for a real API later if needed.

import * as React from "react";
import {
	type Application,
	type ApplicationStatus,
	type ActivityEntry,
	type ActivityType,
	SEED_APPLICATIONS,
	SEED_ACTIVITY,
	isoOffset,
} from "@/lib/data/applications";

const STORAGE_KEY = "gig-nexus:v1";

type Store = {
	applications: Application[];
	activity: ActivityEntry[];
};

type LogInput = Partial<Application> &
	Pick<Application, "roleTitle" | "company" | "platform" | "status">;

type StoreContext = {
	applications: Application[];
	activity: ActivityEntry[];
	logApplication: (input: LogInput) => void;
	updateApplication: (id: string, patch: Partial<Application>) => void;
	deleteApplication: (id: string) => void;
	moveStatus: (id: string, status: ApplicationStatus) => void;
	markFollowedUp: (id: string) => void;
};

const Ctx = React.createContext<StoreContext | null>(null);

function now(): string {
	return isoOffset(0);
}

function logActivity(
	activity: ActivityEntry[],
	type: ActivityType,
	title: string,
	applicationId?: string
): ActivityEntry[] {
	return [
		{ id: `act-${Date.now()}`, type, title, at: now(), applicationId },
		...activity,
	];
}

export function ApplicationsProvider({ children }: { children: React.ReactNode }) {
	const [store, setStore] = React.useState<Store>({
		applications: SEED_APPLICATIONS,
		activity: SEED_ACTIVITY,
	});

	// Load persisted state on mount (client only).
	React.useEffect(() => {
		try {
			const raw = localStorage.getItem(STORAGE_KEY);
			if (raw) setStore(JSON.parse(raw) as Store);
		} catch {
			// ignore corrupt storage, fall back to seed
		}
	}, []);

	// Persist on change.
	React.useEffect(() => {
		try {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
		} catch {
			// ignore quota / private-mode errors
		}
	}, [store]);

	const value = React.useMemo<StoreContext>(() => {
		const ACTIVITY_FOR: Partial<Record<ApplicationStatus, ActivityType>> = {
			applied: "submitted",
			screening: "response",
			interview: "interview",
			rejected: "rejected",
		};

		return {
			applications: store.applications,
			activity: store.activity,

			logApplication(input) {
				const id = `app-${Date.now()}`;
				const app: Application = {
					id,
					url: undefined,
					budget: undefined,
					notes: undefined,
					matchScore: undefined,
					outcome: null,
					dateApplied: input.dateApplied ?? now(),
					...input,
					statusHistory: [{ status: input.status, changedAt: now() }],
					createdAt: now(),
					updatedAt: now(),
				};
				setStore((s) => ({
					applications: [app, ...s.applications],
					activity: logActivity(
						s.activity,
						input.status === "prospect" ? "note" : "submitted",
						`Logged ${app.roleTitle} at ${app.company}`,
						id
					),
				}));
			},

			updateApplication(id, patch) {
				setStore((s) => ({
					...s,
					applications: s.applications.map((a) =>
						a.id === id ? { ...a, ...patch, updatedAt: now() } : a
					),
				}));
			},

			deleteApplication(id) {
				setStore((s) => ({
					...s,
					applications: s.applications.filter((a) => a.id !== id),
				}));
			},

			moveStatus(id, status) {
				setStore((s) => {
					const target = s.applications.find((a) => a.id === id);
					if (!target || target.status === status) return s;
					return {
						applications: s.applications.map((a) =>
							a.id === id
								? {
										...a,
										status,
										outcome:
											status === "rejected"
												? "rejected"
												: status === "offer"
													? "hired"
													: a.outcome,
										statusHistory: [
											...a.statusHistory,
											{ status, changedAt: now() },
										],
										updatedAt: now(),
									}
								: a
						),
						activity: ACTIVITY_FOR[status]
							? logActivity(
									s.activity,
									ACTIVITY_FOR[status]!,
									`${target.roleTitle} moved to ${status}`,
									id
								)
							: s.activity,
					};
				});
			},

			markFollowedUp(id) {
				setStore((s) => {
					const target = s.applications.find((a) => a.id === id);
					if (!target) return s;
					return {
						applications: s.applications.map((a) =>
							a.id === id
								? { ...a, followUpDueDate: isoOffset(7), updatedAt: now() }
								: a
						),
						activity: logActivity(
							s.activity,
							"followup",
							`Followed up with ${target.company}`,
							id
						),
					};
				});
			},
		};
	}, [store]);

	return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApplications(): StoreContext {
	const ctx = React.useContext(Ctx);
	if (!ctx) {
		throw new Error("useApplications must be used within <ApplicationsProvider>");
	}
	return ctx;
}
