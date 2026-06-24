"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { PlatformBadge } from "@/components/app-badges";
import { useApplications } from "@/lib/data/store";
import {
	daysAgo,
	shortDate,
	type Application,
} from "@/lib/data/applications";
import { CheckIcon, MailIcon, CopyIcon, BellRingIcon } from "lucide-react";

export function FollowUpsClient() {
	const { applications, markFollowedUp } = useApplications();
	const [draft, setDraft] = React.useState<Application | null>(null);

	const active = applications.filter(
		(a) =>
			a.followUpDueDate && a.status !== "closed" && a.status !== "rejected"
	);
	const overdue = active.filter((a) => daysAgo(a.followUpDueDate!) > 0);
	const today = active.filter((a) => daysAgo(a.followUpDueDate!) === 0);
	const upcoming = active.filter((a) => {
		const d = daysAgo(a.followUpDueDate!);
		return d < 0 && d >= -7;
	});

	const sortByDue = (a: Application, b: Application) =>
		daysAgo(b.followUpDueDate!) - daysAgo(a.followUpDueDate!);

	return (
		<div className="space-y-6">
			<div>
				<h1 className="font-heading font-semibold text-xl tracking-tight">Follow-ups</h1>
				<p className="text-muted-foreground text-sm">
					Stay on top of the nudges that move applications forward.
				</p>
			</div>

			{overdue.length === 0 && today.length === 0 && upcoming.length === 0 && (
				<div className="rounded-lg border py-16 text-center">
					<BellRingIcon className="mx-auto size-8 text-muted-foreground" />
					<p className="mt-3 font-medium">You&apos;re all caught up.</p>
					<p className="text-muted-foreground text-sm">No follow-ups in the next 7 days.</p>
				</div>
			)}

			<Section title="Overdue" tone="red" items={overdue.sort(sortByDue)} onMark={markFollowedUp} onDraft={setDraft} />
			<Section title="Due today" tone="amber" items={today.sort(sortByDue)} onMark={markFollowedUp} onDraft={setDraft} />
			<Section title="Upcoming" tone="default" items={upcoming.sort(sortByDue)} onMark={markFollowedUp} onDraft={setDraft} />

			<DraftModal app={draft} onOpenChange={(o) => !o && setDraft(null)} />
		</div>
	);
}

const TONE: Record<"red" | "amber" | "default", string> = {
	red: "text-red-600 dark:text-red-400",
	amber: "text-amber-600 dark:text-amber-400",
	default: "text-foreground",
};

function Section({
	title,
	tone,
	items,
	onMark,
	onDraft,
}: {
	title: string;
	tone: "red" | "amber" | "default";
	items: Application[];
	onMark: (id: string) => void;
	onDraft: (a: Application) => void;
}) {
	if (items.length === 0) return null;
	return (
		<section className="space-y-2">
			<h2 className={cn("font-semibold text-sm", TONE[tone])}>
				{title} <span className="text-muted-foreground">({items.length})</span>
			</h2>
			<ul className="divide-y divide-border overflow-hidden rounded-lg border">
				{items.map((a) => {
					const over = daysAgo(a.followUpDueDate!);
					return (
						<li key={a.id} className="flex flex-wrap items-center gap-3 p-3">
							<div className="min-w-0 flex-1">
								<p className="truncate font-medium text-sm">{a.roleTitle}</p>
								<p className="truncate text-muted-foreground text-xs">{a.company}</p>
							</div>
							<PlatformBadge platform={a.platform} />
							<div className="w-28 text-right text-xs tabular-nums">
								<span className="block text-muted-foreground">
									{shortDate(a.followUpDueDate)}
								</span>
								{over > 0 && (
									<span className="font-medium text-red-600 dark:text-red-400">
										{over}d overdue
									</span>
								)}
								{over === 0 && (
									<span className="font-medium text-amber-600 dark:text-amber-400">
										Due today
									</span>
								)}
							</div>
							<div className="flex items-center gap-1.5">
								<Button variant="outline" size="sm" onClick={() => onDraft(a)}>
									<MailIcon /> Draft
								</Button>
								<Button size="sm" onClick={() => onMark(a.id)}>
									<CheckIcon /> Mark followed up
								</Button>
							</div>
						</li>
					);
				})}
			</ul>
		</section>
	);
}

function DraftModal({
	app,
	onOpenChange,
}: {
	app: Application | null;
	onOpenChange: (open: boolean) => void;
}) {
	const [copied, setCopied] = React.useState(false);
	const message = app ? template(app) : "";

	React.useEffect(() => {
		setCopied(false);
	}, [app?.id]);

	async function copy() {
		try {
			await navigator.clipboard.writeText(message);
			setCopied(true);
		} catch {
			// clipboard blocked — user can still select + copy manually
		}
	}

	return (
		<Sheet open={app !== null} onOpenChange={onOpenChange}>
			<SheetContent className="w-full gap-0 sm:max-w-md">
				<SheetHeader className="border-b">
					<SheetTitle>Follow-up message</SheetTitle>
					<SheetDescription>
						{app ? `${app.roleTitle} · ${app.company}` : ""}
					</SheetDescription>
				</SheetHeader>
				<div className="flex-1 overflow-y-auto p-4">
					<textarea
						readOnly
						className="min-h-64 w-full rounded-lg border border-input bg-muted/30 p-3 text-sm outline-none"
						value={message}
					/>
				</div>
				<SheetFooter className="flex-row justify-end gap-2 border-t">
					<Button variant="outline" onClick={() => onOpenChange(false)}>
						Close
					</Button>
					<Button onClick={copy}>
						{copied ? <CheckIcon /> : <CopyIcon />}
						{copied ? "Copied" : "Copy message"}
					</Button>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}

function template(a: Application): string {
	return `Hi there,

I wanted to follow up on my application for the ${a.roleTitle} role${
		a.company ? ` at ${a.company}` : ""
	}. I'm still very interested and would love to share more about how I can help${
		a.company ? ` ${a.company}` : ""
	} with automation and AI workflows.

Is there any update on the next steps? Happy to hop on a quick call at your convenience.

Thanks for your time,
[Your name]`;
}
