"use client";

import { Button } from "@/components/ui/button";
import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { DashboardCard } from "@/components/dashboard-card";
import { ArrowRightIcon } from "lucide-react";

const jobs = [
	{
		id: "upwork-1",
		title: "AI Automation Expert (n8n + Make)",
		source: "Upwork",
		budget: "$2,400",
	},
	{
		id: "indeed-1",
		title: "AI Workflow Developer – Remote",
		source: "Indeed",
		budget: "$1,200",
	},
	{
		id: "onlinejobs-1",
		title: "No-Code Automation Specialist",
		source: "OnlineJobs.ph",
		budget: "$890",
	},
	{
		id: "upwork-2",
		title: "ChatGPT Integration & API Automation",
		source: "Upwork",
		budget: "$5,000",
	},
] as const;

export function DashboardInvoices() {
	return (
		<DashboardCard className="relative gap-0 md:col-span-2">
			<CardHeader className="border-b">
				<CardTitle className="text-base">Latest Jobs</CardTitle>
				<CardDescription>Most recent AI Automation listings across all sources.</CardDescription>
			</CardHeader>
			<CardContent className="mask-b-from-50% mask-b-to-100% px-0">
				<Table>
					<TableCaption className="sr-only">
						Latest job listings with title, source platform, and budget.
					</TableCaption>
					<TableHeader>
						<TableRow>
							<TableHead className="ps-6">Job Title</TableHead>
							<TableHead>Source</TableHead>
							<TableHead className="pe-6 text-right tabular-nums">
								Budget
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{jobs.map((job) => (
							<TableRow className="h-12" key={job.id}>
								<TableCell className="max-w-48 truncate ps-6 font-medium">
									{job.title}
								</TableCell>
								<TableCell className="text-muted-foreground">
									{job.source}
								</TableCell>
								<TableCell className="pe-6 text-right tabular-nums">
									{job.budget}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
			<div className="mask-t-from-30% absolute inset-x-0 bottom-0 flex h-1/5 items-center justify-center bg-background">
				<Button className="relative" variant="ghost" render={<a href="/#" />} nativeButton={false}>
					View All Jobs
					<ArrowRightIcon aria-hidden="true" />
				</Button>
			</div>
		</DashboardCard>
	);
}
