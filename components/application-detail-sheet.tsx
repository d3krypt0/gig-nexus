"use client";

import * as React from "react";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlatformBadge, StatusBadge } from "@/components/app-badges";
import { ApplicationFormSheet } from "@/components/application-form-sheet";
import { useApplications } from "@/lib/data/store";
import {
	STATUS_ORDER,
	STATUS_META,
	shortDate,
	type ApplicationStatus,
} from "@/lib/data/applications";
import { PencilIcon, Trash2Icon, ChevronDownIcon, ExternalLinkIcon } from "lucide-react";

export function ApplicationDetailSheet({
	applicationId,
	open,
	onOpenChange,
}: {
	applicationId: string | null;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}) {
	const { applications, updateApplication, deleteApplication, moveStatus } =
		useApplications();
	const app = applications.find((a) => a.id === applicationId);
	const [editing, setEditing] = React.useState(false);
	const [notes, setNotes] = React.useState("");

	React.useEffect(() => {
		setNotes(app?.notes ?? "");
	}, [app?.id, app?.notes]);

	if (!app) return null;

	return (
		<>
			<Sheet open={open && !editing} onOpenChange={onOpenChange}>
				<SheetContent className="w-full gap-0 sm:max-w-md">
					<SheetHeader className="border-b">
						<div className="flex flex-wrap items-center gap-2">
							<StatusBadge status={app.status} />
							<PlatformBadge platform={app.platform} />
						</div>
						<SheetTitle className="mt-1 text-pretty">{app.roleTitle}</SheetTitle>
						<SheetDescription>{app.company}</SheetDescription>
					</SheetHeader>

					<div className="flex-1 space-y-5 overflow-y-auto p-4">
						<dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm">
							<Detail label="Budget / rate" value={app.budget ?? "—"} />
							<Detail label="Match score" value={app.matchScore ? `${app.matchScore}%` : "—"} />
							<Detail label="Date applied" value={shortDate(app.dateApplied)} />
							<Detail label="Response" value={app.responseReceivedAt ? shortDate(app.responseReceivedAt) : "—"} />
							<Detail label="Interview" value={app.interviewDate ? shortDate(app.interviewDate) : "—"} />
							<Detail label="Follow-up due" value={app.followUpDueDate ? shortDate(app.followUpDueDate) : "—"} />
						</dl>

						{app.url && (
							<a
								href={app.url}
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center gap-1.5 text-blue-600 text-sm hover:underline dark:text-blue-400"
							>
								<ExternalLinkIcon className="size-3.5" /> View job posting
							</a>
						)}

						<div className="space-y-1.5">
							<p className="font-medium text-foreground/80 text-xs">Notes</p>
							<textarea
								className="min-h-28 w-full rounded-lg border border-input bg-transparent p-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
								value={notes}
								onChange={(e) => setNotes(e.target.value)}
								onBlur={() => updateApplication(app.id, { notes: notes.trim() || undefined })}
								placeholder="Auto-saves when you click away…"
							/>
						</div>

						<div className="space-y-2">
							<p className="font-medium text-foreground/80 text-xs">Status timeline</p>
							<ol className="space-y-2.5 border-l pl-4">
								{app.statusHistory.map((h, i) => (
									<li key={`${h.status}-${i}`} className="relative">
										<span
											className="-left-[1.32rem] absolute top-1 size-2 rounded-full ring-2 ring-background"
											style={{ backgroundColor: STATUS_META[h.status].accent }}
										/>
										<p className="text-sm leading-none">{STATUS_META[h.status].label}</p>
										<p className="text-muted-foreground text-xs">{shortDate(h.changedAt)}</p>
									</li>
								))}
							</ol>
						</div>
					</div>

					<div className="flex items-center gap-2 border-t p-4">
						<Button variant="outline" size="sm" onClick={() => setEditing(true)}>
							<PencilIcon /> Edit
						</Button>
						<DropdownMenu>
							<DropdownMenuTrigger
								render={
									<Button variant="outline" size="sm">
										Move status <ChevronDownIcon />
									</Button>
								}
							/>
							<DropdownMenuContent align="start">
								{[...STATUS_ORDER, "closed" as ApplicationStatus].map((s) => (
									<DropdownMenuItem key={s} onClick={() => moveStatus(app.id, s)}>
										<StatusBadge status={s} /> {app.status === s ? "(current)" : ""}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
						<Button
							variant="ghost"
							size="sm"
							className="ml-auto text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400"
							onClick={() => {
								if (confirm(`Delete "${app.roleTitle}"? This can't be undone.`)) {
									deleteApplication(app.id);
									onOpenChange(false);
								}
							}}
						>
							<Trash2Icon /> Delete
						</Button>
					</div>
				</SheetContent>
			</Sheet>

			<ApplicationFormSheet
				open={editing}
				onOpenChange={setEditing}
				application={app}
			/>
		</>
	);
}

function Detail({ label, value }: { label: string; value: string }) {
	return (
		<div>
			<dt className="text-muted-foreground text-xs">{label}</dt>
			<dd className="font-medium tabular-nums">{value}</dd>
		</div>
	);
}
