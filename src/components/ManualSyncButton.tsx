import { RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ManualSyncButtonProps {
	onSync: () => Promise<boolean>
	isOnline: boolean
	isSyncing: boolean
	pendingOperationsCount: number
}

export function ManualSyncButton({
	onSync,
	isOnline,
	isSyncing,
	pendingOperationsCount,
}: ManualSyncButtonProps) {
	const handleSync = async () => {
		if (!isOnline || isSyncing || pendingOperationsCount === 0) return

		try {
			await onSync()
		} catch (error) {
			console.error("Manual sync failed:", error)
		}
	}

	const isDisabled = !isOnline || isSyncing || pendingOperationsCount === 0

	const getButtonText = () => {
		if (!isOnline) return "Offline"
		if (isSyncing) return "Syncing..."
		if (pendingOperationsCount === 0) return "All synced"
		return `Sync ${pendingOperationsCount} item${pendingOperationsCount !== 1 ? "s" : ""}`
	}

	return (
		<Button
			variant="outline"
			size="sm"
			onClick={handleSync}
			disabled={isDisabled}
			className="flex items-center gap-2">
			<RefreshCw className={`w-4 h-4 ${isSyncing ? "animate-spin" : ""}`} />
			{getButtonText()}
		</Button>
	)
}
