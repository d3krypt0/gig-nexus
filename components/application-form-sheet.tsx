"use client";

import * as React from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApplications } from "@/lib/data/store";
import {
	PLATFORMS,
	PLATFORM_META,
	STATUS_ORDER,
	STATUS_META,
	type Application,
	type ApplicationStatus,
	type Platform,
	isoOffset,
} from "@/lib/data/applications";

const fieldClass =
	"h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
	return (
		<label className="flex flex-col gap-1.5 text-sm">
			<span className="font-medium text-foreground/80 text-xs">{label}</span>
			{children}
		</label>
	);
}

type Prefill = Partial<
	Pick<Application, "roleTitle" | "company" | "platform" | "budget" | "matchScore">
>;

export function ApplicationFormSheet({
	open,
	onOpenChange,
	application,
	prefill,
	defaultStatus = "applied",
}: {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	application?: Application;
	prefill?: Prefill;
	defaultStatus?: ApplicationStatus;
}) {
	const { logApplication, updateApplication } = useApplications();
	const editing = Boolean(application);

	// Re-seed the form whenever a different application (or create mode) opens.
	const [form, setForm] = React.useState(() => initial(application, defaultStatus, prefill));
	React.useEffect(() => {
		if (open) setForm(initial(application, defaultStatus, prefill));
	}, [open, application, defaultStatus, prefill]);

	function set<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
		setForm((f) => ({ ...f, [key]: value }));
	}

	function submit(e: React.FormEvent) {
		e.preventDefault();
		if (!form.roleTitle.trim() || !form.company.trim()) return; // required fields
		const patch = {
			roleTitle: form.roleTitle.trim(),
			company: form.company.trim(),
			platform: form.platform,
			status: form.status,
			budget: form.budget.trim() || undefined,
			dateApplied: form.dateApplied,
			url: form.url.trim() || undefined,
			followUpDueDate: form.followUpDueDate || undefined,
			matchScore: form.matchScore ? Number(form.matchScore) : undefined,
			notes: form.notes.trim() || undefined,
		};
		if (editing && application) {
			updateApplication(application.id, patch);
		} else {
			logApplication(patch);
		}
		onOpenChange(false);
	}

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent className="w-full gap-0 sm:max-w-md">
				<SheetHeader className="border-b">
					<SheetTitle>{editing ? "Edit application" : "Log application"}</SheetTitle>
					<SheetDescription>
						{editing
							? "Update the details for this application."
							: "Track a new role you've applied to or are eyeing."}
					</SheetDescription>
				</SheetHeader>

				<form onSubmit={submit} className="flex min-h-0 flex-1 flex-col">
					<div className="flex-1 space-y-4 overflow-y-auto p-4">
						<Field label="Role title *">
							<Input
								value={form.roleTitle}
								onChange={(e) => set("roleTitle", e.target.value)}
								placeholder="Senior n8n Workflow Developer"
								required
							/>
						</Field>
						<Field label="Company *">
							<Input
								value={form.company}
								onChange={(e) => set("company", e.target.value)}
								placeholder="Flowstack Labs"
								required
							/>
						</Field>
						<div className="grid grid-cols-2 gap-3">
							<Field label="Platform">
								<select
									className={fieldClass}
									value={form.platform}
									onChange={(e) => set("platform", e.target.value as Platform)}
								>
									{PLATFORMS.map((p) => (
										<option key={p} value={p}>
											{PLATFORM_META[p].label}
										</option>
									))}
								</select>
							</Field>
							<Field label="Status">
								<select
									className={fieldClass}
									value={form.status}
									onChange={(e) =>
										set("status", e.target.value as ApplicationStatus)
									}
								>
									{[...STATUS_ORDER, "closed" as const].map((s) => (
										<option key={s} value={s}>
											{STATUS_META[s].label}
										</option>
									))}
								</select>
							</Field>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<Field label="Budget / rate">
								<Input
									value={form.budget}
									onChange={(e) => set("budget", e.target.value)}
									placeholder="$45/hr"
								/>
							</Field>
							<Field label="Match %">
								<Input
									type="number"
									min={0}
									max={100}
									value={form.matchScore}
									onChange={(e) => set("matchScore", e.target.value)}
									placeholder="90"
								/>
							</Field>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<Field label="Date applied">
								<input
									type="date"
									className={fieldClass}
									value={form.dateApplied}
									onChange={(e) => set("dateApplied", e.target.value)}
								/>
							</Field>
							<Field label="Follow-up due">
								<input
									type="date"
									className={fieldClass}
									value={form.followUpDueDate}
									onChange={(e) => set("followUpDueDate", e.target.value)}
								/>
							</Field>
						</div>
						<Field label="Job URL">
							<Input
								value={form.url}
								onChange={(e) => set("url", e.target.value)}
								placeholder="https://…"
							/>
						</Field>
						<Field label="Notes">
							<textarea
								className="min-h-24 w-full rounded-lg border border-input bg-transparent p-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
								value={form.notes}
								onChange={(e) => set("notes", e.target.value)}
								placeholder="Anything worth remembering…"
							/>
						</Field>
					</div>
					<SheetFooter className="flex-row justify-end gap-2 border-t">
						<Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
							Cancel
						</Button>
						<Button type="submit">{editing ? "Save" : "Log application"}</Button>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}

function initial(
	application: Application | undefined,
	defaultStatus: ApplicationStatus,
	prefill?: Prefill
) {
	return {
		roleTitle: application?.roleTitle ?? prefill?.roleTitle ?? "",
		company: application?.company ?? prefill?.company ?? "",
		platform: application?.platform ?? prefill?.platform ?? ("upwork" as Platform),
		status: application?.status ?? defaultStatus,
		budget: application?.budget ?? prefill?.budget ?? "",
		matchScore:
			application?.matchScore != null
				? String(application.matchScore)
				: prefill?.matchScore != null
					? String(prefill.matchScore)
					: "",
		dateApplied: application?.dateApplied ?? isoOffset(0),
		followUpDueDate: application?.followUpDueDate ?? "",
		url: application?.url ?? "",
		notes: application?.notes ?? "",
	};
}
