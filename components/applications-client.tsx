"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PlatformBadge, StatusBadge } from "@/components/app-badges";
import { ApplicationFormSheet } from "@/components/application-form-sheet";
import { ApplicationDetailSheet } from "@/components/application-detail-sheet";
import { useApplications } from "@/lib/data/store";
import {
	PLATFORMS,
	PLATFORM_META,
	STATUS_ORDER,
	STATUS_META,
	shortDate,
	daysAgo,
	parseDate,
	type ApplicationStatus,
	type Platform,
} from "@/lib/data/applications";
import {
	PlusIcon,
	PencilIcon,
	ChevronDownIcon,
	Trash2Icon,
	ClipboardListIcon,
} from "lucide-react";

const ALL_STATUSES: (ApplicationStatus | "all")[] = [
	"all",
	...STATUS_ORDER,
	"closed",
];

export function ApplicationsClient() {
	const { applications, moveStatus, deleteApplication } = useApplications();

	const [status, setStatus] = React.useState<ApplicationStatus | "all">("all");
	const [platform, setPlatform] = React.useState<Platform | "all">("all");
	const [from, setFrom] = React.useState("");
	const [to, setTo] = React.useState("");
	const [query, setQuery] = React.useState("");

	const [creating, setCreating] = React.useState(false);
	const [editId, setEditId] = React.useState<string | null>(null);
	const [detailId, setDetailId] = React.useState<string | null>(null);

	const rows = applications
		.filter((a) => status === "all" || a.status === status)
		.filter((a) => platform === "all" || a.platform === platform)
		.filter((a) => !from || a.dateApplied >= from)
		.filter((a) => !to || a.dateApplied <= to)
		.filter((a) => {
			if (!query.trim()) return true;
			const q = query.toLowerCase();
			return (
				a.roleTitle.toLowerCase().includes(q) ||
				a.company.toLowerCase().includes(q)
			);
		})
		.sort(
			(a, b) => parseDate(b.dateApplied).getTime() - parseDate(a.dateApplied).getTime()
		);

	const editApp = applications.find((a) => a.id === editId);

	return (
		<div className="space-y-5">
			<div className="flex flex-wrap items-center justify-between gap-3">
				<div>
					<h1 className="font-heading font-semibold text-xl tracking-tight">My applications</h1>
					<p className="text-muted-foreground text-sm">
						{rows.length} of {applications.length} applications
					</p>
				</div>
				<Button onClick={() => setCreating(true)}>
					<PlusIcon /> Log application
				</Button>
			</div>

			{/* filters */}
			<div className="flex flex-wrap items-center gap-2">
				<Filter value={status} onChange={(v) => setStatus(v as ApplicationStatus | "all")} aria-label="Status">
					{ALL_STATUSES.map((s) => (
						<option key={s} value={s}>
							{s === "all" ? "All statuses" : STATUS_META[s].label}
						</option>
					))}
				</Filter>
				<Filter value={platform} onChange={(v) => setPlatform(v as Platform | "all")} aria-label="Platform">
					<option value="all">All platforms</option>
					{PLATFORMS.map((p) => (
						<option key={p} value={p}>
							{PLATFORM_META[p].label}
						</option>
					))}
				</Filter>
				<input
					type="date"
					aria-label="From date"
					className={dateInputClass}
					value={from}
					onChange={(e) => setFrom(e.target.value)}
				/>
				<span className="text-muted-foreground text-sm">→</span>
				<input
					type="date"
					aria-label="To date"
					className={dateInputClass}
					value={to}
					onChange={(e) => setTo(e.target.value)}
				/>
				<Input
					className="h-8 w-48"
					placeholder="Search role or company…"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
				/>
			</div>

			{rows.length === 0 ? (
				<Empty className="rounded-lg border py-16">
					<EmptyHeader>
						<EmptyMedia variant="icon">
							<ClipboardListIcon />
						</EmptyMedia>
						<EmptyTitle>
							{applications.length === 0 ? "No applications yet." : "No matches."}
						</EmptyTitle>
						<EmptyDescription>
							{applications.length === 0
								? "Log your first one to start tracking your job hunt."
								: "Try clearing a filter or search term."}
						</EmptyDescription>
					</EmptyHeader>
					{applications.length === 0 && (
						<EmptyContent>
							<Button onClick={() => setCreating(true)}>
								<PlusIcon /> Log application
							</Button>
						</EmptyContent>
					)}
				</Empty>
			) : (
				<div className="overflow-x-auto rounded-lg border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="ps-4">Role</TableHead>
								<TableHead>Company</TableHead>
								<TableHead>Platform</TableHead>
								<TableHead>Date Applied</TableHead>
								<TableHead>Status</TableHead>
								<TableHead>Budget</TableHead>
								<TableHead>Response</TableHead>
								<TableHead>Follow-up Due</TableHead>
								<TableHead className="pe-4 text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{rows.map((a) => {
								const overdue =
									a.followUpDueDate &&
									a.status !== "closed" &&
									a.status !== "rejected" &&
									daysAgo(a.followUpDueDate) > 0;
								return (
									<TableRow
										key={a.id}
										className="group h-12 cursor-pointer transition-colors hover:bg-muted/50"
										onClick={() => setDetailId(a.id)}
									>
										<TableCell className="max-w-52 truncate ps-4 font-medium">
											{a.roleTitle}
										</TableCell>
										<TableCell className="text-muted-foreground">{a.company}</TableCell>
										<TableCell>
											<PlatformBadge platform={a.platform} />
										</TableCell>
										<TableCell className="whitespace-nowrap tabular-nums">
											{shortDate(a.dateApplied)}
										</TableCell>
										<TableCell>
											<StatusBadge status={a.status} />
										</TableCell>
										<TableCell className="whitespace-nowrap tabular-nums">
											{a.budget ?? "—"}
										</TableCell>
										<TableCell className="text-muted-foreground">
											{a.responseReceivedAt ? "Yes" : "—"}
										</TableCell>
										<TableCell
											className={cn(
												"whitespace-nowrap tabular-nums",
												overdue && "font-medium text-red-600 dark:text-red-400"
											)}
										>
											{a.followUpDueDate ? shortDate(a.followUpDueDate) : "—"}
										</TableCell>
										<TableCell
											className="pe-4 text-right"
											onClick={(e) => e.stopPropagation()}
										>
											<div className="flex items-center justify-end gap-0.5">
												<Button
													variant="ghost"
													size="icon-sm"
													aria-label="Edit"
													onClick={() => setEditId(a.id)}
												>
													<PencilIcon />
												</Button>
												<DropdownMenu>
													<DropdownMenuTrigger
														render={
															<Button variant="ghost" size="icon-sm" aria-label="Move status">
																<ChevronDownIcon />
															</Button>
														}
													/>
													<DropdownMenuContent align="end">
														{[...STATUS_ORDER, "closed" as ApplicationStatus].map((s) => (
															<DropdownMenuItem key={s} onClick={() => moveStatus(a.id, s)}>
																<StatusBadge status={s} />
															</DropdownMenuItem>
														))}
													</DropdownMenuContent>
												</DropdownMenu>
												<Button
													variant="ghost"
													size="icon-sm"
													aria-label="Delete"
													className="text-red-600 hover:bg-red-500/10 hover:text-red-600 dark:text-red-400"
													onClick={() => {
														if (confirm(`Delete "${a.roleTitle}"?`)) deleteApplication(a.id);
													}}
												>
													<Trash2Icon />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			)}

			<ApplicationFormSheet open={creating} onOpenChange={setCreating} />
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

const dateInputClass =
	"h-8 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

function Filter({
	value,
	onChange,
	children,
	...props
}: {
	value: string;
	onChange: (v: string) => void;
	children: React.ReactNode;
	"aria-label": string;
}) {
	return (
		<select
			className={dateInputClass}
			value={value}
			onChange={(e) => onChange(e.target.value)}
			{...props}
		>
			{children}
		</select>
	);
}
