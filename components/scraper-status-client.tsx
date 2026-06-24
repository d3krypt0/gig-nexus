"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	CardContent,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DashboardCard } from "@/components/dashboard-card";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { PLATFORM_META, type Platform } from "@/lib/data/applications";
import { RefreshCwIcon, ChevronRightIcon, AlertTriangleIcon } from "lucide-react";

type RunState = "success" | "failed" | "running";

type Source = {
	platform: Platform;
	state: RunState;
	lastRun: string;
	jobsFound: number;
	nextRun: string;
	errors: { at: string; message: string }[];
};

// ponytail: scraper isn't wired to anything real — static mock + a simulated
// "Run now". Swap `runNow` for a fetch to the scraper service when one exists.
const SEED: Source[] = [
	{
		platform: "upwork",
		state: "success",
		lastRun: "2 hours ago",
		jobsFound: 47,
		nextRun: "in 4 hours",
		errors: [],
	},
	{
		platform: "linkedin",
		state: "failed",
		lastRun: "3 hours ago",
		jobsFound: 0,
		nextRun: "in 1 hour",
		errors: [
			{ at: "3 hours ago", message: "Auth challenge / login wall hit (429)" },
			{ at: "9 hours ago", message: "Selector drift: job card container not found" },
			{ at: "Yesterday", message: "Rate limited after 120 requests" },
		],
	},
	{
		platform: "indeed",
		state: "success",
		lastRun: "1 hour ago",
		jobsFound: 23,
		nextRun: "in 5 hours",
		errors: [{ at: "2 days ago", message: "Timeout fetching page 4 of results" }],
	},
	{
		platform: "onlinejobs",
		state: "success",
		lastRun: "5 hours ago",
		jobsFound: 18,
		nextRun: "in 1 hour",
		errors: [],
	},
];

const DOT: Record<RunState, string> = {
	success: "bg-emerald-500",
	failed: "bg-red-500",
	running: "bg-amber-500 animate-pulse",
};

const LABEL: Record<RunState, string> = {
	success: "Success",
	failed: "Failed",
	running: "Running…",
};

export function ScraperStatusClient() {
	const [sources, setSources] = React.useState<Source[]>(SEED);

	function runNow(platform: Platform) {
		setSources((prev) =>
			prev.map((s) => (s.platform === platform ? { ...s, state: "running" } : s))
		);
		// Simulate a scrape completing.
		window.setTimeout(() => {
			setSources((prev) =>
				prev.map((s) =>
					s.platform === platform
						? {
								...s,
								state: "success",
								lastRun: "just now",
								jobsFound: 10 + Math.floor(Math.random() * 40),
							}
						: s
				)
			);
		}, 1200);
	}

	return (
		<div className="space-y-5">
			<div>
				<h1 className="font-heading font-semibold text-xl tracking-tight">Scraper status</h1>
				<p className="text-muted-foreground text-sm">
					Health and recent runs for each job source.
				</p>
			</div>

			<div className="grid gap-4 md:grid-cols-2">
				{sources.map((s) => {
					const meta = PLATFORM_META[s.platform];
					return (
						<DashboardCard
							key={s.platform}
							className="gap-0 overflow-hidden rounded-lg border"
						>
							<CardHeader className="flex flex-row items-center justify-between border-b">
								<div className="flex items-center gap-2">
									<span
										className="size-2.5 rounded-full"
										style={{ backgroundColor: meta.color }}
									/>
									<CardTitle className="text-base">{meta.label}</CardTitle>
								</div>
								<div className="flex items-center gap-1.5 text-xs">
									<span className={cn("size-2 rounded-full", DOT[s.state])} />
									<span className="text-muted-foreground">{LABEL[s.state]}</span>
								</div>
							</CardHeader>
							<CardContent className="space-y-3 py-4">
								<dl className="grid grid-cols-3 gap-2 text-sm">
									<Stat label="Last run" value={s.lastRun} />
									<Stat
										label="Jobs found"
										value={s.state === "running" ? "—" : String(s.jobsFound)}
									/>
									<Stat label="Next run" value={s.nextRun} />
								</dl>

								<div className="flex items-center justify-between gap-2">
									<ErrorLog errors={s.errors} />
									<Button
										variant="outline"
										size="sm"
										disabled={s.state === "running"}
										onClick={() => runNow(s.platform)}
									>
										<RefreshCwIcon className={cn(s.state === "running" && "animate-spin")} />
										Run now
									</Button>
								</div>
							</CardContent>
						</DashboardCard>
					);
				})}
			</div>
		</div>
	);
}

function Stat({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<dt className="text-muted-foreground text-xs">{label}</dt>
			<dd className="font-medium tabular-nums">{value}</dd>
		</div>
	);
}

function ErrorLog({ errors }: { errors: Source["errors"] }) {
	if (errors.length === 0) {
		return <span className="text-muted-foreground text-xs">No recent errors</span>;
	}
	return (
		<Collapsible className="group/err min-w-0 flex-1">
			<CollapsibleTrigger
				render={
					<button
						type="button"
						className="flex items-center gap-1 text-red-600 text-xs hover:underline dark:text-red-400"
					/>
				}
			>
				<ChevronRightIcon className="size-3.5 transition-transform group-data-[open]/err:rotate-90" />
				<AlertTriangleIcon className="size-3.5" />
				{errors.length} recent error{errors.length > 1 ? "s" : ""}
			</CollapsibleTrigger>
			<CollapsibleContent>
				<ul className="mt-2 space-y-1.5">
					{errors.slice(0, 5).map((e, i) => (
						<li key={i} className="rounded-md bg-red-500/5 px-2 py-1.5 text-xs">
							<span className="text-muted-foreground">{e.at}</span>
							<span className="block text-foreground/80">{e.message}</span>
						</li>
					))}
				</ul>
			</CollapsibleContent>
		</Collapsible>
	);
}
