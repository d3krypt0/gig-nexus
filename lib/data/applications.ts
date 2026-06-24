// Mock data layer for the job-application tracker. No DB connected — static seed
// plus pure selectors. All relative-date math is anchored to TODAY so renders are
// deterministic (no SSR hydration drift). ponytail: fixed anchor, swap for `new Date()`
// + a mounted gate if this ever needs to "age" in real time.

export const TODAY = new Date("2026-06-24T12:00:00");

export type ApplicationStatus =
	| "prospect"
	| "applied"
	| "screening"
	| "interview"
	| "offer"
	| "rejected"
	| "closed";

export type Platform = "upwork" | "linkedin" | "indeed" | "onlinejobs";

export type ActivityType =
	| "submitted"
	| "response"
	| "interview"
	| "offer"
	| "rejected"
	| "followup"
	| "note";

export interface Application {
	id: string;
	roleTitle: string;
	company: string;
	platform: Platform;
	url?: string;
	dateApplied: string; // ISO date
	status: ApplicationStatus;
	budget?: string;
	notes?: string;
	responseReceivedAt?: string;
	interviewDate?: string;
	followUpDueDate?: string;
	outcome?: "hired" | "rejected" | "withdrawn" | null;
	matchScore?: number; // 0-100
	statusHistory: { status: ApplicationStatus; changedAt: string }[];
	createdAt: string;
	updatedAt: string;
}

export interface ActivityEntry {
	id: string;
	type: ActivityType;
	title: string;
	at: string; // ISO datetime
	applicationId?: string;
}

// ---------------------------------------------------------------------------
// Metadata: platforms + statuses (labels, colors, badge classes)
// ---------------------------------------------------------------------------

export const PLATFORM_META: Record<
	Platform,
	{ label: string; color: string; badgeClass: string }
> = {
	upwork: {
		label: "Upwork",
		color: "#10B981",
		badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
	},
	linkedin: {
		label: "LinkedIn",
		color: "#3B82F6",
		badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
	},
	indeed: {
		label: "Indeed",
		color: "#F59E0B",
		badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
	},
	onlinejobs: {
		label: "Onlinejobs.ph",
		color: "#8B5CF6",
		badgeClass: "bg-violet-500/10 text-violet-600 dark:text-violet-400",
	},
};

export const PLATFORMS = Object.keys(PLATFORM_META) as Platform[];

export const STATUS_ORDER: ApplicationStatus[] = [
	"prospect",
	"applied",
	"screening",
	"interview",
	"offer",
	"rejected",
];

export const STATUS_META: Record<
	ApplicationStatus,
	{ label: string; badgeClass: string; accent: string }
> = {
	prospect: {
		label: "Prospect",
		badgeClass: "bg-zinc-500/10 text-zinc-600 dark:text-zinc-400",
		accent: "#71717a",
	},
	applied: {
		label: "Applied",
		badgeClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
		accent: "#3B82F6",
	},
	screening: {
		label: "Screening",
		badgeClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
		accent: "#F59E0B",
	},
	interview: {
		label: "Interview",
		badgeClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
		accent: "#06B6D4",
	},
	offer: {
		label: "Offer",
		badgeClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
		accent: "#10B981",
	},
	rejected: {
		label: "Rejected",
		badgeClass: "bg-red-500/10 text-red-600 dark:text-red-400",
		accent: "#EF4444",
	},
	closed: {
		label: "Closed",
		badgeClass: "bg-zinc-400/10 text-muted-foreground",
		accent: "#a1a1aa",
	},
};

// ---------------------------------------------------------------------------
// Date helpers (all relative to TODAY)
// ---------------------------------------------------------------------------

export function parseDate(iso: string): Date {
	return new Date(iso.length <= 10 ? `${iso}T12:00:00` : iso);
}

export function daysBetween(from: Date, to: Date): number {
	const ms = to.getTime() - from.getTime();
	return Math.round(ms / 86_400_000);
}

/** Whole days since an ISO date relative to TODAY (positive = past). */
export function daysAgo(iso: string): number {
	return daysBetween(parseDate(iso), TODAY);
}

export function isoOffset(days: number): string {
	const d = new Date(TODAY);
	d.setDate(d.getDate() + days);
	return d.toISOString().slice(0, 10);
}

export function shortDate(iso?: string): string {
	if (!iso) return "—";
	return parseDate(iso).toLocaleDateString("en-US", {
		day: "numeric",
		month: "short",
		year: "numeric",
	});
}

// ---------------------------------------------------------------------------
// Seed data — 16 applications across every status + all 4 platforms
// ---------------------------------------------------------------------------

function hist(
	...steps: [ApplicationStatus, number][]
): { status: ApplicationStatus; changedAt: string }[] {
	return steps.map(([status, offset]) => ({
		status,
		changedAt: isoOffset(offset),
	}));
}

export const SEED_APPLICATIONS: Application[] = [
	{
		id: "app-01",
		roleTitle: "Senior n8n Workflow Developer",
		company: "Flowstack Labs",
		platform: "upwork",
		url: "https://upwork.com/jobs/01",
		dateApplied: isoOffset(-3),
		status: "applied",
		budget: "$45/hr",
		matchScore: 94,
		followUpDueDate: isoOffset(2),
		statusHistory: hist(["prospect", -5], ["applied", -3]),
		createdAt: isoOffset(-5),
		updatedAt: isoOffset(-3),
	},
	{
		id: "app-02",
		roleTitle: "Make.com Automation Specialist",
		company: "Northwind Digital",
		platform: "upwork",
		dateApplied: isoOffset(-12),
		status: "screening",
		budget: "$2,500/mo",
		matchScore: 88,
		responseReceivedAt: isoOffset(-9),
		followUpDueDate: isoOffset(-1),
		notes: "Recruiter asked for a sample scenario. Sent Loom walkthrough.",
		statusHistory: hist(["applied", -12], ["screening", -9]),
		createdAt: isoOffset(-12),
		updatedAt: isoOffset(-9),
	},
	{
		id: "app-03",
		roleTitle: "AI Automation Engineer (LLM + n8n)",
		company: "Bright Orbit",
		platform: "linkedin",
		dateApplied: isoOffset(-18),
		status: "interview",
		budget: "$70/hr",
		matchScore: 91,
		responseReceivedAt: isoOffset(-14),
		interviewDate: isoOffset(1),
		followUpDueDate: isoOffset(0),
		notes: "Technical interview scheduled. Prep: RAG pipelines, vector stores.",
		statusHistory: hist(["applied", -18], ["screening", -14], ["interview", -6]),
		createdAt: isoOffset(-18),
		updatedAt: isoOffset(-6),
	},
	{
		id: "app-04",
		roleTitle: "LLM Integration Engineer",
		company: "Cohere Path",
		platform: "linkedin",
		dateApplied: isoOffset(-25),
		status: "offer",
		budget: "$8,000/mo",
		matchScore: 97,
		responseReceivedAt: isoOffset(-21),
		interviewDate: isoOffset(-8),
		outcome: "hired",
		notes: "Offer received! Reviewing contract terms.",
		statusHistory: hist(
			["applied", -25],
			["screening", -21],
			["interview", -12],
			["offer", -2]
		),
		createdAt: isoOffset(-25),
		updatedAt: isoOffset(-2),
	},
	{
		id: "app-05",
		roleTitle: "No-Code Automation Builder",
		company: "Tindahan Tech",
		platform: "onlinejobs",
		dateApplied: isoOffset(-30),
		status: "rejected",
		budget: "$1,200/mo",
		matchScore: 72,
		responseReceivedAt: isoOffset(-26),
		outcome: "rejected",
		notes: "Went with a candidate in their timezone.",
		statusHistory: hist(["applied", -30], ["screening", -26], ["rejected", -20]),
		createdAt: isoOffset(-30),
		updatedAt: isoOffset(-20),
	},
	{
		id: "app-06",
		roleTitle: "Zapier & API Automation Consultant",
		company: "Ledgerwise",
		platform: "indeed",
		dateApplied: isoOffset(-6),
		status: "applied",
		budget: "$55/hr",
		matchScore: 83,
		followUpDueDate: isoOffset(1),
		statusHistory: hist(["applied", -6]),
		createdAt: isoOffset(-6),
		updatedAt: isoOffset(-6),
	},
	{
		id: "app-07",
		roleTitle: "Workflow Automation Architect",
		company: "Vela Systems",
		platform: "upwork",
		dateApplied: isoOffset(-40),
		status: "closed",
		budget: "$60/hr",
		matchScore: 79,
		outcome: "withdrawn",
		notes: "Withdrew — scope creep, client unresponsive.",
		statusHistory: hist(["applied", -40], ["screening", -34], ["closed", -28]),
		createdAt: isoOffset(-40),
		updatedAt: isoOffset(-28),
	},
	{
		id: "app-08",
		roleTitle: "AI Agent Developer (Python + LangChain)",
		company: "Synthwave AI",
		platform: "linkedin",
		dateApplied: isoOffset(-2),
		status: "applied",
		budget: "$75/hr",
		matchScore: 96,
		followUpDueDate: isoOffset(5),
		statusHistory: hist(["applied", -2]),
		createdAt: isoOffset(-2),
		updatedAt: isoOffset(-2),
	},
	{
		id: "app-09",
		roleTitle: "Chatbot & RAG Pipeline Engineer",
		company: "Helpwise",
		platform: "indeed",
		dateApplied: isoOffset(-15),
		status: "screening",
		budget: "$3,200/mo",
		matchScore: 85,
		responseReceivedAt: isoOffset(-11),
		followUpDueDate: isoOffset(3),
		statusHistory: hist(["applied", -15], ["screening", -11]),
		createdAt: isoOffset(-15),
		updatedAt: isoOffset(-11),
	},
	{
		id: "app-10",
		roleTitle: "Marketing Automation Specialist (n8n)",
		company: "Growthlite",
		platform: "onlinejobs",
		dateApplied: isoOffset(-9),
		status: "interview",
		budget: "$1,800/mo",
		matchScore: 81,
		responseReceivedAt: isoOffset(-6),
		interviewDate: isoOffset(3),
		followUpDueDate: isoOffset(2),
		statusHistory: hist(["applied", -9], ["screening", -6], ["interview", -2]),
		createdAt: isoOffset(-9),
		updatedAt: isoOffset(-2),
	},
	{
		id: "app-11",
		roleTitle: "Prompt Engineer & Automation Lead",
		company: "Quanta Forge",
		platform: "linkedin",
		dateApplied: isoOffset(-22),
		status: "rejected",
		budget: "$6,000/mo",
		matchScore: 74,
		responseReceivedAt: isoOffset(-18),
		outcome: "rejected",
		statusHistory: hist(["applied", -22], ["screening", -18], ["rejected", -10]),
		createdAt: isoOffset(-22),
		updatedAt: isoOffset(-10),
	},
	{
		id: "app-12",
		roleTitle: "Backend Automation Developer (APIs)",
		company: "Pipeline Co",
		platform: "indeed",
		dateApplied: isoOffset(-1),
		status: "applied",
		budget: "$50/hr",
		matchScore: 87,
		followUpDueDate: isoOffset(6),
		statusHistory: hist(["applied", -1]),
		createdAt: isoOffset(-1),
		updatedAt: isoOffset(-1),
	},
	{
		id: "app-13",
		roleTitle: "AI Automation Builder (GPT + Make)",
		company: "Loopline",
		platform: "upwork",
		status: "prospect",
		dateApplied: isoOffset(0),
		budget: "$40/hr",
		matchScore: 90,
		notes: "Saved — strong fit. Need to tailor proposal.",
		statusHistory: hist(["prospect", -1]),
		createdAt: isoOffset(-1),
		updatedAt: isoOffset(-1),
	},
	{
		id: "app-14",
		roleTitle: "Voice AI & Telephony Automation Dev",
		company: "Dialwise",
		platform: "onlinejobs",
		status: "prospect",
		dateApplied: isoOffset(0),
		budget: "$1,500/mo",
		matchScore: 77,
		statusHistory: hist(["prospect", 0]),
		createdAt: isoOffset(0),
		updatedAt: isoOffset(0),
	},
	{
		id: "app-15",
		roleTitle: "Data Pipeline & ETL Automation Engineer",
		company: "Streamform",
		platform: "linkedin",
		dateApplied: isoOffset(-20),
		status: "offer",
		budget: "$85/hr",
		matchScore: 93,
		responseReceivedAt: isoOffset(-16),
		interviewDate: isoOffset(-5),
		outcome: "hired",
		statusHistory: hist(
			["applied", -20],
			["screening", -16],
			["interview", -7],
			["offer", -1]
		),
		createdAt: isoOffset(-20),
		updatedAt: isoOffset(-1),
	},
	{
		id: "app-16",
		roleTitle: "Customer Support Automation Specialist",
		company: "Replyflow",
		platform: "indeed",
		dateApplied: isoOffset(-11),
		status: "screening",
		budget: "$2,000/mo",
		matchScore: 80,
		responseReceivedAt: isoOffset(-7),
		followUpDueDate: isoOffset(-2),
		statusHistory: hist(["applied", -11], ["screening", -7]),
		createdAt: isoOffset(-11),
		updatedAt: isoOffset(-7),
	},
];

export const SEED_ACTIVITY: ActivityEntry[] = [
	{ id: "act-1", type: "offer", title: "Offer received from Cohere Path", at: isoOffset(-2), applicationId: "app-04" },
	{ id: "act-2", type: "interview", title: "Interview scheduled with Bright Orbit", at: isoOffset(-6), applicationId: "app-03" },
	{ id: "act-3", type: "response", title: "Helpwise replied to your application", at: isoOffset(-11), applicationId: "app-09" },
	{ id: "act-4", type: "submitted", title: "Applied to Synthwave AI", at: isoOffset(-2), applicationId: "app-08" },
	{ id: "act-5", type: "rejected", title: "Quanta Forge passed on your application", at: isoOffset(-10), applicationId: "app-11" },
	{ id: "act-6", type: "submitted", title: "Applied to Pipeline Co", at: isoOffset(-1), applicationId: "app-12" },
];

// ---------------------------------------------------------------------------
// Pure selectors — take an array so they work on live store state too
// ---------------------------------------------------------------------------

const RESPONDED: ApplicationStatus[] = ["screening", "interview", "offer"];

export function hasResponse(a: Application): boolean {
	return Boolean(a.responseReceivedAt) || RESPONDED.includes(a.status);
}

export function reachedInterview(a: Application): boolean {
	return (
		a.status === "interview" ||
		a.status === "offer" ||
		a.statusHistory.some((h) => h.status === "interview")
	);
}

export interface Metrics {
	totalApplied: number;
	responseRate: number;
	interviewRate: number;
	activePipeline: number;
	followUpsDue: number;
	offers: number;
}

export function computeMetrics(apps: Application[]): Metrics {
	const applied = apps.filter((a) => a.status !== "prospect");
	const totalApplied = applied.length || 1; // guard divide-by-zero
	const responses = applied.filter(hasResponse).length;
	const interviews = applied.filter(reachedInterview).length;
	return {
		totalApplied: applied.length,
		responseRate: Math.round((responses / totalApplied) * 100),
		interviewRate: Math.round((interviews / totalApplied) * 100),
		activePipeline: apps.filter(
			(a) => a.status === "screening" || a.status === "interview"
		).length,
		followUpsDue: apps.filter(
			(a) =>
				a.followUpDueDate &&
				daysAgo(a.followUpDueDate) >= 0 &&
				a.status !== "closed" &&
				a.status !== "rejected"
		).length,
		offers: apps.filter((a) => a.status === "offer").length,
	};
}

/** Count of applications submitted per day over the last `days` days. */
export function appliedPerDay(
	apps: Application[],
	days = 14
): { day: string; count: number }[] {
	const out: { day: string; count: number }[] = [];
	for (let i = days - 1; i >= 0; i--) {
		const iso = isoOffset(-i);
		out.push({
			day: parseDate(iso).toLocaleDateString("en-US", {
				day: "numeric",
				month: "short",
			}),
			count: apps.filter((a) => a.status !== "prospect" && a.dateApplied === iso)
				.length,
		});
	}
	return out;
}

/** Cumulative applications per platform over time, for the multi-line chart. */
export function appliedByPlatformSeries(
	apps: Application[],
	days = 30
): { date: string; upwork: number; linkedin: number; indeed: number; onlinejobs: number }[] {
	const submitted = apps.filter((a) => a.status !== "prospect");
	const rows: { date: string; upwork: number; linkedin: number; indeed: number; onlinejobs: number }[] = [];
	const totals = { upwork: 0, linkedin: 0, indeed: 0, onlinejobs: 0 };
	for (let i = days - 1; i >= 0; i--) {
		const iso = isoOffset(-i);
		for (const a of submitted) {
			if (a.dateApplied === iso) totals[a.platform] += 1;
		}
		rows.push({ date: iso, ...totals });
	}
	return rows;
}

export function platformTotals(apps: Application[]): Record<Platform, number> {
	const out = { upwork: 0, linkedin: 0, indeed: 0, onlinejobs: 0 } as Record<Platform, number>;
	for (const a of apps) {
		if (a.status !== "prospect") out[a.platform] += 1;
	}
	return out;
}

/** Applications with a follow-up due within `withinDays` (incl. overdue). */
export function followUpsDue(apps: Application[], withinDays = 3): Application[] {
	return apps
		.filter(
			(a) =>
				a.followUpDueDate &&
				a.status !== "closed" &&
				a.status !== "rejected" &&
				daysAgo(a.followUpDueDate) >= -withinDays
		)
		.sort((a, b) => parseDate(a.followUpDueDate!).getTime() - parseDate(b.followUpDueDate!).getTime());
}
