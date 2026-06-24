import {
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { DashboardCard } from "@/components/dashboard-card";
import { RefreshCwIcon, BookmarkIcon, SearchIcon, BellIcon } from "lucide-react";

const items = [
	{
		title: "Scraper synced 47 new jobs from Upwork",
		time: "About 2 hours ago",
		icon: <RefreshCwIcon />,
	},
	{
		title: 'You saved "AI Automation Expert" on Indeed',
		time: "This morning",
		icon: <BookmarkIcon />,
	},
	{
		title: 'New keyword alert: "n8n developer" matched 12 jobs',
		time: "Yesterday",
		icon: <BellIcon />,
	},
	{
		title: "OnlineJobs.ph scrape completed — 18 results",
		time: "2 days ago",
		icon: <SearchIcon />,
	},
] as const;

export function DashboardActivity() {
	return (
		<DashboardCard className="gap-0">
			<CardHeader className="border-b">
				<CardTitle>Recent Activity</CardTitle>
				<CardDescription>Latest scraper runs and saved jobs.</CardDescription>
			</CardHeader>
			<CardContent className="px-0">
				<ul className="flex flex-col divide-y divide-border">
					{items.map((item) => (
						<li className="flex h-16 items-center gap-3 px-6" key={item.title}>
							<span
								aria-hidden="true"
								className="flex size-10 shrink-0 items-center justify-center [&_svg]:size-4"
							>
								{item.icon}
							</span>
							<div className="min-w-0 flex-1 space-y-1">
								<p className="line-clamp-1 text-pretty text-foreground text-sm leading-snug">
									{item.title}
								</p>
								<p className="text-muted-foreground text-xs">{item.time}</p>
							</div>
						</li>
					))}
				</ul>
			</CardContent>
		</DashboardCard>
	);
}
