"use client";

import { cn } from "@/lib/utils";
import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DashboardCard } from "@/components/dashboard-card";
import { PlatformBadge } from "@/components/app-badges";
import { useApplications } from "@/lib/data/store";
import { followUpsDue, daysAgo, shortDate } from "@/lib/data/applications";

export function DashboardFollowups() {
	const { applications } = useApplications();
	const due = followUpsDue(applications, 3).slice(0, 5);

	return (
		<DashboardCard className="gap-0 overflow-hidden rounded-lg border">
			<CardHeader className="border-b">
				<CardTitle className="text-base">Follow-ups due</CardTitle>
				<CardDescription>Nudges due within the next 3 days.</CardDescription>
			</CardHeader>
			<CardContent className="px-0">
				{due.length === 0 ? (
					<p className="px-6 py-8 text-center text-muted-foreground text-sm">
						Nothing due. You&apos;re on top of it.
					</p>
				) : (
					<ul className="flex flex-col divide-y divide-border">
						{due.map((a) => {
							const overdueDays = daysAgo(a.followUpDueDate!);
							const tone =
								overdueDays > 0
									? "text-red-600 dark:text-red-400"
									: overdueDays === 0
										? "text-amber-600 dark:text-amber-400"
										: "text-muted-foreground";
							return (
								<li key={a.id} className="flex items-center gap-3 px-6 py-2.5">
									<div className="min-w-0 flex-1">
										<p className="truncate font-medium text-sm">{a.roleTitle}</p>
										<p className="truncate text-muted-foreground text-xs">
											{a.company}
										</p>
									</div>
									<PlatformBadge platform={a.platform} />
									<span className={cn("shrink-0 text-right text-xs tabular-nums", tone)}>
										{overdueDays > 0
											? `${overdueDays}d overdue`
											: overdueDays === 0
												? "Due today"
												: shortDate(a.followUpDueDate)}
									</span>
								</li>
							);
						})}
					</ul>
				)}
			</CardContent>
		</DashboardCard>
	);
}
