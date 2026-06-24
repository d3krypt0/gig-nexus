"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlatformBadge } from "@/components/app-badges";
import { ApplicationFormSheet } from "@/components/application-form-sheet";
import { ApplicationDetailSheet } from "@/components/application-detail-sheet";
import { useApplications } from "@/lib/data/store";
import {
	STATUS_ORDER,
	STATUS_META,
	daysAgo,
	shortDate,
	type Application,
	type ApplicationStatus,
} from "@/lib/data/applications";
import { PlusIcon, MoreHorizontalIcon, PencilIcon, Trash2Icon, XIcon } from "lucide-react";

const COLUMNS = STATUS_ORDER; // prospect → rejected

export function PipelineClient() {
	const { applications, moveStatus, deleteApplication } = useApplications();
	const [dragId, setDragId] = React.useState<string | null>(null);
	const [overCol, setOverCol] = React.useState<ApplicationStatus | null>(null);

	const [createStatus, setCreateStatus] = React.useState<ApplicationStatus | null>(null);
	const [editId, setEditId] = React.useState<string | null>(null);
	const [detailId, setDetailId] = React.useState<string | null>(null);
	const editApp = applications.find((a) => a.id === editId);

	function onDrop(status: ApplicationStatus) {
		if (dragId) moveStatus(dragId, status);
		setDragId(null);
		setOverCol(null);
	}

	return (
		<div className="flex h-full flex-col gap-4">
			<div>
				<h1 className="font-heading font-semibold text-xl tracking-tight">Pipeline</h1>
				<p className="text-muted-foreground text-sm">
					Drag cards between columns to update their status.
				</p>
			</div>

			<div className="-mx-4 flex flex-1 gap-3 overflow-x-auto px-4 pb-2 md:-mx-6 md:px-6">
				{COLUMNS.map((status) => {
					const cards = applications.filter((a) => a.status === status);
					const meta = STATUS_META[status];
					return (
						<section
							key={status}
							className={cn(
								"flex w-72 shrink-0 flex-col rounded-lg border bg-muted/30 transition-colors",
								overCol === status && "ring-2 ring-blue-500/40"
							)}
							onDragOver={(e) => {
								e.preventDefault();
								setOverCol(status);
							}}
							onDragLeave={(e) => {
								// only clear when leaving the column, not entering a child
								if (!e.currentTarget.contains(e.relatedTarget as Node))
									setOverCol(null);
							}}
							onDrop={() => onDrop(status)}
						>
							<header
								className="flex items-center justify-between gap-2 border-l-[3px] px-3 py-2.5"
								style={{ borderLeftColor: meta.accent }}
							>
								<div className="flex items-center gap-2">
									<span className="font-medium text-sm">{meta.label}</span>
									<Badge variant="secondary" className="tabular-nums">
										{cards.length}
									</Badge>
								</div>
							</header>

							<div className="flex flex-1 flex-col gap-2 overflow-y-auto p-2">
								{cards.map((a) => (
									<PipelineCard
										key={a.id}
										app={a}
										dragging={dragId === a.id}
										onDragStart={() => setDragId(a.id)}
										onDragEnd={() => {
											setDragId(null);
											setOverCol(null);
										}}
										onOpen={() => setDetailId(a.id)}
										onEdit={() => setEditId(a.id)}
										onReject={() => moveStatus(a.id, "rejected")}
										onDelete={() => {
											if (confirm(`Delete "${a.roleTitle}"?`)) deleteApplication(a.id);
										}}
									/>
								))}
							</div>

							<Button
								variant="ghost"
								size="sm"
								className="m-2 justify-start text-muted-foreground"
								onClick={() => setCreateStatus(status)}
							>
								<PlusIcon /> Add
							</Button>
						</section>
					);
				})}
			</div>

			<ApplicationFormSheet
				open={createStatus !== null}
				onOpenChange={(o) => !o && setCreateStatus(null)}
				defaultStatus={createStatus ?? "applied"}
			/>
			<ApplicationFormSheet
				open={editId !== null}
				onOpenChange={(o) => !o && setEditId(null)}
				application={editApp}
			/>
			<ApplicationDetailSheet
				applicationId={detailId}
				open={detailId !== null}
				onOpenChange={(o) => !o && setDetailId(null)}
			/>
		</div>
	);
}

function PipelineCard({
	app,
	dragging,
	onDragStart,
	onDragEnd,
	onOpen,
	onEdit,
	onReject,
	onDelete,
}: {
	app: Application;
	dragging: boolean;
	onDragStart: () => void;
	onDragEnd: () => void;
	onOpen: () => void;
	onEdit: () => void;
	onReject: () => void;
	onDelete: () => void;
}) {
	const since = daysAgo(app.dateApplied);
	return (
		<article
			draggable
			onDragStart={onDragStart}
			onDragEnd={onDragEnd}
			onClick={onOpen}
			className={cn(
				"group cursor-pointer rounded-lg border bg-background p-3 shadow-sm transition hover:border-blue-500/40",
				dragging && "opacity-40"
			)}
		>
			<div className="flex items-start justify-between gap-1">
				<p className="line-clamp-1 font-medium text-sm">{app.roleTitle}</p>
				<DropdownMenu>
					<DropdownMenuTrigger
						render={
							<Button
								variant="ghost"
								size="icon-sm"
								aria-label="Card menu"
								className="-mr-1 -mt-1 size-6 shrink-0 opacity-0 group-hover:opacity-100"
								onClick={(e) => e.stopPropagation()}
							>
								<MoreHorizontalIcon />
							</Button>
						}
					/>
					<DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
						<DropdownMenuItem onClick={onEdit}>
							<PencilIcon /> Edit
						</DropdownMenuItem>
						<DropdownMenuItem onClick={onReject}>
							<XIcon /> Mark as rejected
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={onDelete}
							className="text-red-600 dark:text-red-400"
						>
							<Trash2Icon /> Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<p className="mt-0.5 truncate text-muted-foreground text-xs">{app.company}</p>
			<div className="mt-2.5 flex items-center justify-between gap-2">
				<PlatformBadge platform={app.platform} />
				<span className="text-muted-foreground text-xs tabular-nums">
					{app.budget ?? ""}
				</span>
			</div>
			<p className="mt-2 text-muted-foreground text-xs">
				{app.status === "interview" && app.interviewDate
					? `Interview ${shortDate(app.interviewDate)}`
					: since <= 0
						? "Today"
						: `${since}d ago`}
			</p>
		</article>
	);
}
