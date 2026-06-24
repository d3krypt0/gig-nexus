"use client";

import { useId } from "react";
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
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta";
import { DashboardCard } from "@/components/dashboard-card";

const VISIBLE_DAYS = 7;

/** One row per day: ISO `date`, `upwork` / `indeed` = jobs found per source. */
type ChannelSalesChartRow = {
	date: string;
	upwork: number;
	indeed: number;
};

/** Demo Data. */
const chartData: ChannelSalesChartRow[] = [
	{ date: "2026-03-15", upwork: 28, indeed: 14 },
	{ date: "2026-03-16", upwork: 24, indeed: 12 },
	{ date: "2026-03-17", upwork: 30, indeed: 16 },
	{ date: "2026-03-18", upwork: 22, indeed: 10 },
	{ date: "2026-03-19", upwork: 26, indeed: 13 },
	{ date: "2026-03-20", upwork: 20, indeed: 9 },
	{ date: "2026-03-21", upwork: 32, indeed: 17 },
	{ date: "2026-03-22", upwork: 27, indeed: 15 },
	{ date: "2026-03-23", upwork: 18, indeed: 8 },
	{ date: "2026-03-24", upwork: 29, indeed: 14 },
	{ date: "2026-03-25", upwork: 21, indeed: 11 },
	{ date: "2026-03-26", upwork: 35, indeed: 19 },
	{ date: "2026-03-27", upwork: 23, indeed: 12 },
	{ date: "2026-03-28", upwork: 31, indeed: 16 },
	{ date: "2026-03-29", upwork: 19, indeed: 10 },
	{ date: "2026-03-30", upwork: 33, indeed: 18 },
	{ date: "2026-03-31", upwork: 25, indeed: 13 },
	{ date: "2026-04-01", upwork: 40, indeed: 22 },
	{ date: "2026-04-02", upwork: 38, indeed: 20 },
	{ date: "2026-04-03", upwork: 36, indeed: 19 },
	{ date: "2026-04-04", upwork: 42, indeed: 23 },
	{ date: "2026-04-05", upwork: 34, indeed: 18 },
	{ date: "2026-04-06", upwork: 16, indeed: 7 },
	{ date: "2026-04-07", upwork: 14, indeed: 6 },
	{ date: "2026-04-08", upwork: 37, indeed: 20 },
	{ date: "2026-04-09", upwork: 44, indeed: 24 },
	{ date: "2026-04-10", upwork: 41, indeed: 22 },
	{ date: "2026-04-11", upwork: 48, indeed: 26 },
	{ date: "2026-04-12", upwork: 45, indeed: 25 },
	{ date: "2026-04-13", upwork: 52, indeed: 28 },
];

/** Most recent daily rows shown in the chart. */
const chartRows = chartData.slice(-VISIBLE_DAYS);

function rowTotal(row: ChannelSalesChartRow) {
	return row.upwork + row.indeed;
}

function growthPctForWindow(rows: readonly ChannelSalesChartRow[]) {
	const first = rows[0];
	if (!first) {
		return 0;
	}
	const last = rows.at(-1);
	if (!last) {
		return 0;
	}
	const a = rowTotal(first);
	const b = rowTotal(last);
	if (!a) {
		return 0;
	}
	return ((b - a) / a) * 100;
}

const growthPctNum = growthPctForWindow(chartRows);

const chartConfig = {
	upwork: {
		label: "Upwork",
		color: "var(--chart-2)",
	},
	indeed: {
		label: "Indeed",
		color: "var(--chart-1)",
	},
} satisfies ChartConfig;

export function ChannelSalesChart() {
	const chartUid = useId().replace(/:/g, "");
	const idLineGlow = `channel-sales-line-glow-${chartUid}`;

	return (
		<DashboardCard className="gap-0 md:col-span-2">
			<CardHeader>
				<div className="min-w-0 space-y-2">
					<div className="flex flex-wrap items-center gap-2">
						<CardTitle>Jobs by Source</CardTitle>
						<Delta value={growthPctNum} variant="badge">
							<DeltaIcon variant="trend" />
							<DeltaValue />
						</Delta>
					</div>
					<CardDescription>
						Jobs scraped per platform, last {VISIBLE_DAYS} days.
					</CardDescription>
				</div>
			</CardHeader>
			<CardContent>
				<ChartContainer
					className="aspect-auto h-60 w-full p-0 md:h-80"
					config={chartConfig}
				>
					<LineChart
						accessibilityLayer
						data={chartRows}
						margin={{
							left: 12,
							right: 12,
							top: 8,
						}}
					>
						<CartesianGrid className="stroke-border" vertical={false} />
						<XAxis
							axisLine={false}
							dataKey="date"
							interval={0}
							tickFormatter={(value) => formatDate(String(value), "day-month")}
							tickLine={false}
							tickMargin={8}
						/>
						<ChartTooltip
							content={<ChartTooltipContent hideLabel />}
							cursor={false}
						/>
						<defs>
							<filter
								height="140%"
								id={idLineGlow}
								width="140%"
								x="-20%"
								y="-20%"
							>
								<feGaussianBlur result="blur" stdDeviation="10" />
								<feComposite in="SourceGraphic" in2="blur" operator="over" />
							</filter>
						</defs>
						<Line
							dataKey="indeed"
							dot={false}
							filter={`url(#${idLineGlow})`}
							stroke="var(--color-indeed)"
							strokeWidth={2}
							type="step"
						/>
						<Line
							dataKey="upwork"
							dot={false}
							filter={`url(#${idLineGlow})`}
							stroke="var(--color-upwork)"
							strokeWidth={2}
							type="step"
						/>
					</LineChart>
				</ChartContainer>
			</CardContent>
		</DashboardCard>
	);
}
