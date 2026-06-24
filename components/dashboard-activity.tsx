"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DashboardCard } from "@/components/dashboard-card";
import { useApplications } from "@/lib/data/store";
import { shortDate, type ActivityType } from "@/lib/data/applications";
import {
	CheckCircle2Icon,
	MessageSquareIcon,
	CalendarIcon,
	XCircleIcon,
	TrophyIcon,
	BellRingIcon,
	StickyNoteIcon,
} from "lucide-react";

const ICONS: Record<ActivityType, { icon: ReactNode; className: string }> = {
	submitted: { icon: <CheckCircle2Icon />, className: "text-emerald-500" },
	response: { icon: <MessageSquareIcon />, className: "text-blue-500" },
	interview: { icon: <CalendarIcon />, className: "text-amber-500" },
	rejected: { icon: <XCircleIcon />, className: "text-red-500" },
	offer: { icon: <TrophyIcon />, className: "text-emerald-500" },
	followup: { icon: <BellRingIcon />, className: "text-blue-500" },
	note: { icon: <StickyNoteIcon />, className: "text-muted-foreground" },
};

export function DashboardActivity() {
	const { activity } = useApplications();
	const items = activity.slice(0, 6);

	return (
		<DashboardCard className="gap-0 overflow-hidden rounded-lg border">
			<CardHeader className="border-b">
				<CardTitle>Recent Activity</CardTitle>
				<CardDescription>Latest changes across your applications.</CardDescription>
			</CardHeader>
			<CardContent className="px-0">
				<ul className="flex flex-col divide-y divide-border">
					{items.map((item) => {
						const meta = ICONS[item.type];
						return (
							<li className="flex items-center gap-3 px-6 py-2.5" key={item.id}>
								<span
									aria-hidden="true"
									className={cn(
										"flex size-8 shrink-0 items-center justify-center [&_svg]:size-4",
										meta.className
									)}
								>
									{meta.icon}
								</span>
								<div className="min-w-0 flex-1">
									<p className="line-clamp-1 text-pretty text-foreground text-sm leading-snug">
										{item.title}
									</p>
									<p className="text-muted-foreground text-xs">{shortDate(item.at)}</p>
								</div>
							</li>
						);
					})}
				</ul>
			</CardContent>
		</DashboardCard>
	);
}
