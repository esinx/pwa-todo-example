import { CheckSquare, RefreshCw, WifiOff } from "lucide-react"
import { AddTodo } from "@/components/AddTodo"
import { TodoList } from "@/components/TodoList"
import { SyncStatus } from "@/components/SyncStatus"
import { ManualSyncButton } from "@/components/ManualSyncButton"
import { Button } from "@/components/ui/button"
import { useTodos } from "@/hooks/useTodos"
import "./App.css"

function App() {
	const {
		todos,
		loading,
		error,
		addTodo,
		updateTodo,
		deleteTodo,
		toggleTodo,
		refetch,
		manualSync,
		isOnline,
		isSyncing,
		pendingOperationsCount,
	} = useTodos()

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
			<div className="container mx-auto px-4 py-8 max-w-2xl">
				{/* Header */}
				<div className="text-center mb-8">
					<div className="flex items-center justify-center gap-3 mb-4">
						<CheckSquare className="w-8 h-8 text-blue-600" />
						<h1 className="text-3xl font-bold text-gray-900">PWA Todo</h1>
					</div>
					<p className="text-gray-600">
						A shared Progressive Web App • No sign-up required
					</p>

					{/* Sync Status */}
					<div className="mt-4 flex justify-center">
						<SyncStatus
							isOnline={isOnline}
							isSyncing={isSyncing}
							pendingOperationsCount={pendingOperationsCount}
							error={error}
						/>
					</div>

					{error && (
						<div className="mt-3 flex items-center justify-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">
							<WifiOff className="w-4 h-4" />
							{error}
						</div>
					)}
				</div>

				{/* Add Todo Form */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
					<AddTodo onAdd={addTodo} />
				</div>

				{/* Action Buttons */}
				<div className="flex justify-center gap-3 mb-6">
					<Button
						variant="outline"
						size="sm"
						onClick={refetch}
						disabled={loading || isSyncing}
						className="flex items-center gap-2">
						<RefreshCw
							className={`w-4 h-4 ${loading || isSyncing ? "animate-spin" : ""}`}
						/>
						{loading || isSyncing ? "Loading..." : "Refresh"}
					</Button>

					<ManualSyncButton
						onSync={manualSync}
						isOnline={isOnline}
						isSyncing={isSyncing}
						pendingOperationsCount={pendingOperationsCount}
					/>
				</div>

				{/* Todo List */}
				<div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
					{loading && todos.length === 0 ? (
						<div className="text-center py-8 text-gray-500">
							<RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-gray-400" />
							Loading shared todos...
						</div>
					) : (
						<TodoList
							todos={todos}
							onToggle={toggleTodo}
							onUpdate={updateTodo}
							onDelete={deleteTodo}
						/>
					)}
				</div>

				{/* Footer */}
				<div className="text-center mt-8 text-sm text-gray-500">
					<p>Shared todo list • Works offline • Install as an app</p>
				</div>
			</div>
		</div>
	)
}

export default App
