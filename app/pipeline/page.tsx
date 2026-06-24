import { AppShell } from "@/components/app-shell";
import { PipelineClient } from "@/components/pipeline-client";

export default function PipelinePage() {
	return (
		<AppShell>
			<PipelineClient />
		</AppShell>
	);
}
