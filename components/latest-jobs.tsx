"use client";

import * as React from "react";
import {
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DashboardCard } from "@/components/dashboard-card";
import { PlatformBadge, StatusBadge } from "@/components/app-badges";
import { ApplicationFormSheet } from "@/components/application-form-sheet";
import { useApplications } from "@/lib/data/store";
import { parseDate, type Application } from "@/lib/data/applications";

export function LatestJobs() {
	const { applications } = useApplications();
	const [prefill, setPrefill] = React.useState<Application | null>(null);

	const latest = [...applications]
		.sort(
			(a, b) =>
				parseDate(b.updatedAt).getTime() - parseDate(a.updatedAt).getTime()
		)
		.slice(0, 6);

	return (
		<DashboardCard className="gap-0 overflow-hidden rounded-lg border">
			<CardHeader className="border-b">
				<CardTitle className="text-base">Latest Jobs</CardTitle>
				<CardDescription>
					Your most recently updated applications across all platforms.
				</CardDescription>
			</CardHeader>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="ps-6">Role</TableHead>
						<TableHead>Platform</TableHead>
						<TableHead>Status</TableHead>
						<TableHead className="text-right tabular-nums">Match&nbsp;%</TableHead>
						<TableHead className="pe-6 text-right" />
					</TableRow>
				</TableHeader>
				<TableBody>
					{latest.map((job) => (
						<TableRow
							key={job.id}
							className="group h-12 transition-colors hover:bg-muted/50"
						>
							<TableCell className="max-w-56 truncate ps-6 font-medium">
								{job.roleTitle}
								<span className="block truncate text-muted-foreground text-xs">
									{job.company}
								</span>
							</TableCell>
							<TableCell>
								<PlatformBadge platform={job.platform} />
							</TableCell>
							<TableCell>
								<StatusBadge status={job.status} />
							</TableCell>
							<TableCell className="text-right tabular-nums">
								{job.matchScore ? `${job.matchScore}%` : "—"}
							</TableCell>
							<TableCell className="pe-6 text-right">
								<Button
									variant="outline"
									size="sm"
									className="opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
									onClick={() => setPrefill(job)}
								>
									Quick apply
								</Button>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<ApplicationFormSheet
				open={prefill !== null}
				onOpenChange={(o) => !o && setPrefill(null)}
				prefill={
					prefill
						? {
								roleTitle: prefill.roleTitle,
								company: prefill.company,
								platform: prefill.platform,
								budget: prefill.budget,
								matchScore: prefill.matchScore,
							}
						: undefined
				}
			/>
		</DashboardCard>
	);
}
