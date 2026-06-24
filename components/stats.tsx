"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Delta, DeltaIcon, DeltaValue } from "@/components/delta";
import { DashboardCard } from "@/components/dashboard-card";
import { useApplications } from "@/lib/data/store";
import { computeMetrics } from "@/lib/data/applications";
import {
	SendIcon,
	MessageSquareIcon,
	UsersIcon,
	ActivityIcon,
	BellIcon,
	TrophyIcon,
} from "lucide-react";

type Accent = "green" | "red" | "amber" | "gray";

const ACCENT_BORDER: Record<Accent, string> = {
	green: "border-l-emerald-500",
	red: "border-l-red-500",
	amber: "border-l-amber-500",
	gray: "border-l-border",
};

const ACCENT_TEXT: Record<Accent, string> = {
	green: "text-emerald-600 dark:text-emerald-400",
	red: "text-red-600 dark:text-red-400",
	amber: "text-amber-600 dark:text-amber-400",
	gray: "",
};

function deltaAccent(delta?: number): Accent {
	if (delta == null || delta === 0) return "gray";
	return delta > 0 ? "green" : "red";
}

function MetricCard({
	label,
	value,
	icon,
	delta,
	accent,
	valueAccent = false,
}: {
	label: string;
	value: string;
	icon: ReactNode;
	delta?: number;
	accent: Accent;
	valueAccent?: boolean;
}) {
	return (
		<DashboardCard className={cn("border-l-[3px]", ACCENT_BORDER[accent])}>
			<CardHeader className="flex flex-row items-center justify-between">
				<CardTitle className="font-normal text-muted-foreground text-xs tracking-wide">
					{label}
				</CardTitle>
				<span className="text-muted-foreground [&_svg]:size-4">{icon}</span>
			</CardHeader>
			<CardContent>
				<p
					className={cn(
						"font-semibold text-2xl tabular-nums",
						valueAccent && ACCENT_TEXT[accent]
					)}
				>
					{value}
				</p>
			</CardContent>
			<CardFooter className="gap-1 rounded-none bg-background text-xs">
				{delta != null ? (
					<>
						<Delta value={delta}>
							<DeltaIcon />
							<DeltaValue />
						</Delta>
						<span className="text-muted-foreground">vs last 30 days</span>
					</>
				) : (
					<span className="text-muted-foreground">&nbsp;</span>
				)}
			</CardFooter>
		</DashboardCard>
	);
}

export function DashboardStats() {
	const { applications } = useApplications();
	const m = computeMetrics(applications);

	// ponytail: deltas vs "last 30 days" are display chrome on mock data — fixed
	// plausible values, not a real prior-period diff. Swap for real history later.
	const appliedDelta = 12.5;
	const responseDelta = 4.2;
	const interviewDelta = -1.8;

	const responseAccent: Accent =
		m.responseRate > 25 ? "green" : m.responseRate >= 15 ? "amber" : "red";

	return (
		<>
			<MetricCard
				label="Total Applied"
				value={String(m.totalApplied)}
				icon={<SendIcon />}
				delta={appliedDelta}
				accent={deltaAccent(appliedDelta)}
			/>
			<MetricCard
				label="Response Rate"
				value={`${m.responseRate}%`}
				icon={<MessageSquareIcon />}
				delta={responseDelta}
				accent={responseAccent}
				valueAccent
			/>
			<MetricCard
				label="Interview Rate"
				value={`${m.interviewRate}%`}
				icon={<UsersIcon />}
				delta={interviewDelta}
				accent={deltaAccent(interviewDelta)}
			/>
			<MetricCard
				label="Active Pipeline"
				value={String(m.activePipeline)}
				icon={<ActivityIcon />}
				accent="gray"
			/>
			<MetricCard
				label="Follow-ups Due"
				value={String(m.followUpsDue)}
				icon={<BellIcon />}
				accent={m.followUpsDue > 0 ? "red" : "gray"}
				valueAccent
			/>
			<MetricCard
				label="Offers Received"
				value={String(m.offers)}
				icon={<TrophyIcon />}
				accent={m.offers > 0 ? "green" : "gray"}
				valueAccent
			/>
		</>
	);
}
