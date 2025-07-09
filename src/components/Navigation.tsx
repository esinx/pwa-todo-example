import { CheckSquare, RefreshCw } from "lucide-react"
import { SyncStatus } from "./SyncStatus"
import { ManualSyncButton } from "./ManualSyncButton"

interface NavigationProps {
	isOnline: boolean
	isSyncing: boolean
	pendingOperationsCount: number
	error: string | null
	onRefresh: () => void
	onManualSync: () => Promise<boolean>
	loading: boolean
}

export function Navigation({
	isOnline,
	isSyncing,
	pendingOperationsCount,
	error,
	onRefresh,
	onManualSync,
	loading,
}: NavigationProps) {
	return (
		<nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm nav-backdrop mobile-nav">
			<div className="container mx-auto px-4 max-w-2xl">
				<div className="flex items-center justify-between h-16">
					{/* App Brand */}
					<div className="flex items-center gap-3">
						<CheckSquare className="w-6 h-6 text-blue-600" />
						<h1 className="text-lg font-semibold text-gray-900">PWA Todo</h1>
					</div>

					{/* Actions */}
					<div className="flex items-center gap-2">
						<SyncStatus
							isOnline={isOnline}
							isSyncing={isSyncing}
							pendingOperationsCount={pendingOperationsCount}
							error={error}
						/>

						<button
							onClick={onRefresh}
							disabled={loading || isSyncing}
							className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							title="Refresh">
							<RefreshCw
								className={`w-4 h-4 ${loading || isSyncing ? "animate-spin" : ""}`}
							/>
						</button>

						<ManualSyncButton
							onSync={onManualSync}
							isOnline={isOnline}
							isSyncing={isSyncing}
							pendingOperationsCount={pendingOperationsCount}
						/>
					</div>
				</div>
			</div>
		</nav>
	)
}
