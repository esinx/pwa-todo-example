import {
	Cloud,
	CloudOff,
	Loader2,
	CheckCircle,
	AlertCircle,
} from "lucide-react"

interface SyncStatusProps {
	isOnline: boolean
	isSyncing: boolean
	pendingOperationsCount: number
	error?: string | null
}

export function SyncStatus({
	isOnline,
	isSyncing,
	pendingOperationsCount,
	error,
}: SyncStatusProps) {
	const getStatusText = () => {
		if (isSyncing) return "Syncing..."
		if (!isOnline && pendingOperationsCount > 0) {
			return `Offline - ${pendingOperationsCount} pending`
		}
		if (!isOnline) return "Offline"
		if (pendingOperationsCount > 0) return `${pendingOperationsCount} pending`
		return "All synced"
	}

	const getStatusIcon = () => {
		if (isSyncing) {
			return <Loader2 className="h-4 w-4 animate-spin" />
		}
		if (!isOnline) {
			return <CloudOff className="h-4 w-4" />
		}
		if (error) {
			return <AlertCircle className="h-4 w-4" />
		}
		if (pendingOperationsCount > 0) {
			return <Cloud className="h-4 w-4" />
		}
		return <CheckCircle className="h-4 w-4" />
	}

	const getStatusColor = () => {
		if (isSyncing) return "text-blue-600"
		if (!isOnline) return "text-gray-500"
		if (error) return "text-red-600"
		if (pendingOperationsCount > 0) return "text-orange-600"
		return "text-green-600"
	}

	return (
		<div className={`flex items-center gap-2 text-sm ${getStatusColor()}`}>
			{getStatusIcon()}
			<span>{getStatusText()}</span>
			{error && (
				<span className="text-xs text-red-500" title={error}>
					(!!)
				</span>
			)}
		</div>
	)
}
