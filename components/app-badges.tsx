import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
	PLATFORM_META,
	STATUS_META,
	type Platform,
	type ApplicationStatus,
} from "@/lib/data/applications";

export function PlatformBadge({
	platform,
	className,
}: {
	platform: Platform;
	className?: string;
}) {
	const meta = PLATFORM_META[platform];
	return (
		<Badge
			variant="secondary"
			className={cn("border-none", meta.badgeClass, className)}
		>
			{meta.label}
		</Badge>
	);
}

export function StatusBadge({
	status,
	className,
}: {
	status: ApplicationStatus;
	className?: string;
}) {
	const meta = STATUS_META[status];
	return (
		<Badge
			variant="secondary"
			className={cn("border-none", meta.badgeClass, className)}
		>
			{meta.label}
		</Badge>
	);
}
