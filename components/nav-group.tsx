"use client";

import { usePathname } from "next/navigation";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import type { SidebarNavGroup } from "@/components/app-shared";
import { ChevronRightIcon } from "lucide-react";

export function NavGroup({ label, items }: SidebarNavGroup) {
	const pathname = usePathname();
	const isItemActive = (path?: string) =>
		!!path && path.startsWith("/") && path === pathname;

	return (
		<SidebarGroup>
			{label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
			<SidebarMenu>
				{items.map((item) => {
				const active = isItemActive(item.path);
				return (
					<Collapsible className="group/collapsible" defaultOpen={
                    							active ||
                    							item.subItems?.some((i) => isItemActive(i.path))
                    						} key={item.title} render={<SidebarMenuItem />}>{item.subItems?.length ? (
                    								<>
                    									<CollapsibleTrigger render={<SidebarMenuButton isActive={active} />}>{item.icon}<span>{item.title}</span><ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" /></CollapsibleTrigger>
                    									<CollapsibleContent>
                    										<SidebarMenuSub>
                    											{item.subItems?.map((subItem) => (
                    												<SidebarMenuSubItem key={subItem.title}>
                    													<SidebarMenuSubButton isActive={isItemActive(subItem.path)} render={<a href={subItem.path} />}>{subItem.icon}<span>{subItem.title}</span></SidebarMenuSubButton>
                    												</SidebarMenuSubItem>
                    											))}
                    										</SidebarMenuSub>
                    									</CollapsibleContent>
                    								</>
                    							) : (
                    								<SidebarMenuButton isActive={active} render={<a href={item.path} />}>{item.icon}<span>{item.title}</span></SidebarMenuButton>
                    							)}</Collapsible>
				);
				})}
			</SidebarMenu>
		</SidebarGroup>
	);
}
