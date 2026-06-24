"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { formatDate } from "@/components/formater";
import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { DashboardCard } from "@/components/dashboard-card";
import { useApplications } from "@/lib/data/store";
import {
	appliedByPlatformSeries,
	platformTotals,
	PLATFORM_META,
	PLATFORMS,
} from "@/lib/data/applications";

const chartConfig = {
	upwork: { label: "Upwork", color: PLATFORM_META.upwork.color },
	linkedin: { label: "LinkedIn", color: PLATFORM_META.linkedin.color },
	indeed: { label: "Indeed", color: PLATFORM_META.indeed.color },
	onlinejobs: { label: "Onlinejobs.ph", color: PLATFORM_META.onlinejobs.color },
} satisfies ChartConfig;

export function ApplicationsByPlatformChart({ days = 30 }: { days?: number }) {
	const { applications } = useApplications();
	const rows = appliedByPlatformSeries(applications, days);
	const totals = platformTotals(applications);

	return (
		<DashboardCard className="gap-0">
			<CardHeader>
				<CardTitle>Applications by platform</CardTitle>
				<CardDescription>
					Cumulative applications per platform, last {days} days.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer className="aspect-auto h-52 w-full p-0 md:h-64" config={chartConfig}>
					<LineChart accessibilityLayer data={rows} margin={{ left: 12, right: 12, top: 8 }}>
						<CartesianGrid className="stroke-border" vertical={false} />
						<XAxis
							axisLine={false}
							dataKey="date"
							minTickGap={32}
							tickFormatter={(v) => formatDate(String(v), "day-month")}
							tickLine={false}
							tickMargin={8}
						/>
						<ChartTooltip content={<ChartTooltipContent />} cursor={false} />
						{PLATFORMS.map((p) => (
							<Line
								key={p}
								dataKey={p}
								dot={false}
								stroke={PLATFORM_META[p].color}
								strokeWidth={2}
								type="monotone"
							/>
						))}
					</LineChart>
				</ChartContainer>
				<ul className="mt-3 flex flex-wrap gap-x-5 gap-y-2 border-t pt-3">
					{PLATFORMS.map((p) => (
						<li key={p} className="flex items-center gap-2 text-sm">
							<span
								className="size-2.5 rounded-full"
								style={{ backgroundColor: PLATFORM_META[p].color }}
							/>
							<span className="text-muted-foreground">{PLATFORM_META[p].label}</span>
							<span className="font-medium tabular-nums">{totals[p]}</span>
						</li>
					))}
				</ul>
			</CardContent>
		</DashboardCard>
	);
}
