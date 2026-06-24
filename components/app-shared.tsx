import type { ReactNode } from "react";
import { LayoutDashboardIcon, SearchIcon, BookmarkIcon, ClipboardListIcon, KanbanIcon, BellRingIcon, BarChart2Icon, PieChartIcon, GlobeIcon, RefreshCwIcon, SettingsIcon, HelpCircleIcon, BookOpenIcon } from "lucide-react";

export type SidebarNavItem = {
	title: string;
	path?: string;
	icon?: ReactNode;
	isActive?: boolean;
	subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
	label?: string;
	items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
	{
		label: "Jobs",
		items: [
			{
				title: "Dashboard",
				path: "/",
				icon: <LayoutDashboardIcon />,
			},
			{
				title: "Browse Jobs",
				path: "#/jobs",
				icon: <SearchIcon />,
			},
			{
				title: "Saved Jobs",
				path: "#/saved",
				icon: <BookmarkIcon />,
			},
		],
	},
	{
		label: "Tracker",
		items: [
			{
				title: "My Applications",
				path: "/applications",
				icon: <ClipboardListIcon />,
			},
			{
				title: "Pipeline",
				path: "/pipeline",
				icon: <KanbanIcon />,
			},
			{
				title: "Follow-ups",
				path: "/follow-ups",
				icon: <BellRingIcon />,
			},
		],
	},
	{
		label: "Insights",
		items: [
			{
				title: "Analytics",
				path: "#/analytics",
				icon: <BarChart2Icon />,
			},
			{
				title: "Platform Stats",
				path: "#/platform-stats",
				icon: <PieChartIcon />,
			},
		],
	},
	{
		label: "Administration",
		items: [
			{
				title: "Sources",
				path: "#/sources",
				icon: <GlobeIcon />,
			},
			{
				title: "Scraper Status",
				path: "/scraper-status",
				icon: <RefreshCwIcon />,
			},
			{
				title: "Settings",
				path: "#/settings",
				icon: <SettingsIcon />,
			},
		],
	},
];

export const footerNavLinks: SidebarNavItem[] = [
	{
		title: "Help Center",
		path: "#/help",
		icon: <HelpCircleIcon />,
	},
	{
		title: "Documentation",
		path: "#/documentation",
		icon: <BookOpenIcon />,
	},
];

export const navLinks: SidebarNavItem[] = [
	...navGroups.flatMap((group) =>
		group.items.flatMap((item) =>
			item.subItems?.length ? [item, ...item.subItems] : [item]
		)
	),
	...footerNavLinks,
];
