import { AppShell } from "@/components/app-shell";
import { ScraperStatusClient } from "@/components/scraper-status-client";

export default function ScraperStatusPage() {
	return (
		<AppShell>
			<ScraperStatusClient />
		</AppShell>
	);
}
