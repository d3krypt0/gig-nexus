"use client";

import { Bar, BarChart, ReferenceLine, XAxis, YAxis } from "recharts";
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
import { appliedPerDay } from "@/lib/data/applications";

const WEEKLY_TARGET = 10;
const DAILY_TARGET = WEEKLY_TARGET / 7; // ~1.43/day

const chartConfig = {
	count: { label: "Applications", color: "#3B82F6" },
} satisfies ChartConfig;

export function ApplicationsPerDayChart({ days = 14 }: { days?: number }) {
	const { applications } = useApplications();
	const rows = appliedPerDay(applications, days);

	return (
		<DashboardCard className="gap-0">
			<CardHeader className="gap-2">
				<CardTitle>Applications submitted per day</CardTitle>
				<CardDescription>
					Applications you logged per day, last {days} days. Target {WEEKLY_TARGET}/week.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ChartContainer className="aspect-auto h-60 w-full md:h-80" config={chartConfig}>
					<BarChart accessibilityLayer data={rows} margin={{ top: 8 }}>
						<XAxis
							axisLine={false}
							dataKey="day"
							interval={1}
							tickLine={false}
							tickMargin={10}
						/>
						<YAxis hide />
						<ChartTooltip content={<ChartTooltipContent />} cursor={false} />
						<ReferenceLine
							y={DAILY_TARGET}
							stroke="var(--muted-foreground)"
							strokeDasharray="4 4"
							label={{
								value: "Target",
								position: "insideTopRight",
								fill: "var(--muted-foreground)",
								fontSize: 11,
							}}
						/>
						<Bar dataKey="count" fill="#3B82F6" radius={[3, 3, 0, 0]} />
					</BarChart>
				</ChartContainer>
			</CardContent>
		</DashboardCard>
	);
}
