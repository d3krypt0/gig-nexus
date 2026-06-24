import type { ReactNode } from "react";
import { LayoutGridIcon, SearchIcon, BriefcaseIcon, BookmarkIcon, BarChart3Icon, RefreshCwIcon, SettingsIcon, HelpCircleIcon, BookOpenIcon } from "lucide-react";

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
				path: "#/dashboard",
				icon: <LayoutGridIcon />,
				isActive: true,
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
		label: "Insights",
		items: [
			{
				title: "Analytics",
				path: "#/analytics",
				icon: <BarChart3Icon />,
			},
			{
				title: "Scraper Status",
				path: "#/scraper",
				icon: <RefreshCwIcon />,
			},
		],
	},
	{
		label: "Administration",
		items: [
			{
				title: "Sources",
				path: "#/sources",
				icon: <BriefcaseIcon />,
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
