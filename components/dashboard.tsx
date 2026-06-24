"use client";

import * as React from "react";
import { ApplicationsByPlatformChart } from "@/components/applications-by-platform-chart";
import { ApplicationsPerDayChart } from "@/components/applications-per-day-chart";
import { DashboardActivity } from "@/components/dashboard-activity";
import { DashboardFollowups } from "@/components/dashboard-followups";
import { DashboardStats } from "@/components/stats";
import { LatestJobs } from "@/components/latest-jobs";

const RANGES = [
	{ label: "Last 7 days", days: 7 },
	{ label: "Last 30 days", days: 30 },
	{ label: "Last 90 days", days: 90 },
	{ label: "All time", days: 0 },
] as const;

export function Dashboard() {
	// ponytail: range drives the two time-series charts. Metric cards / lists stay
	// all-time — windowed rates over a 16-row mock read as noise. Thread `apps`
	// through if real filtering is wanted later.
	const [days, setDays] = React.useState(30);
	const chartDays = days === 0 ? 90 : days;

	return (
		<div className="space-y-4 md:space-y-6">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="font-heading font-semibold text-xl tracking-tight">Dashboard</h1>
					<p className="text-muted-foreground text-sm">
						Your job hunt at a glance.
					</p>
				</div>
				<select
					aria-label="Date range"
					className="h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
					value={days}
					onChange={(e) => setDays(Number(e.target.value))}
				>
					{RANGES.map((r) => (
						<option key={r.days} value={r.days}>
							{r.label}
						</option>
					))}
				</select>
			</div>

			{/* 6 metric cards */}
			<div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border md:grid-cols-3 lg:grid-cols-6">
				<DashboardStats />
			</div>

			{/* charts */}
			<div className="grid gap-px overflow-hidden rounded-lg border bg-border lg:grid-cols-2">
				<ApplicationsPerDayChart days={Math.min(chartDays, 30)} />
				<ApplicationsByPlatformChart days={chartDays} />
			</div>

			{/* bottom: latest jobs (60%) + stacked follow-ups/activity (40%) */}
			<div className="grid gap-4 md:gap-6 lg:grid-cols-12">
				<div className="lg:col-span-7">
					<LatestJobs />
				</div>
				<div className="flex flex-col gap-4 md:gap-6 lg:col-span-5">
					<DashboardFollowups />
					<DashboardActivity />
				</div>
			</div>
		</div>
	);
}
