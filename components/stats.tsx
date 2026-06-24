import {
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta";
import { DashboardCard } from "@/components/dashboard-card";

type Stat = {
	label: string;
	value: string;
	delta: number;
};

const stats: Stat[] = [
	{
		label: "Jobs Found",
		value: "1,284",
		delta: 8.3,
	},
	{
		label: "New Today",
		value: "47",
		delta: 15.2,
	},
	{
		label: "Avg. Budget",
		value: "$2,840",
		delta: 4.1,
	},
	{
		label: "Saved Jobs",
		value: "38",
		delta: -2.6,
	},
] as const;

export function DashboardStats() {
	return (
		<>
			{stats.map((s) => (
				<DashboardCard className="" key={s.label}>
					<CardHeader className="flex flex-row items-center justify-between">
						<CardTitle className="font-normal text-xs tracking-wide">
							{s.label}
						</CardTitle>
					</CardHeader>
					<CardContent className="flex flex-row items-center gap-2">
						<p className="font-semibold text-2xl tabular-nums">{s.value}</p>
					</CardContent>
					<CardFooter className="gap-1 rounded-none bg-background text-xs">
						<Delta value={s.delta}>
							<DeltaIcon />
							<DeltaValue />
						</Delta>
						<span className="text-muted-foreground">vs last week</span>{" "}
					</CardFooter>
				</DashboardCard>
			))}
		</>
	);
}
