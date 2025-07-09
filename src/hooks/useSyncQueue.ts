import { useState, useEffect, useCallback } from "react"
import { supabase } from "@/core/supabase"
import type { TablesInsert, TablesUpdate } from "@/types/supabase-types"

export type SyncOperation = {
	id: string
	type: "insert" | "update" | "delete"
	todoId: string
	data?: TablesInsert<"todo"> | TablesUpdate<"todo">
	timestamp: number
	retryCount: number
}

const SYNC_QUEUE_KEY = "sync-queue"
const MAX_RETRY_COUNT = 3

export function useSyncQueue() {
	const [syncQueue, setSyncQueue] = useState<SyncOperation[]>([])
	const [isSyncing, setIsSyncing] = useState(false)
	const [syncError, setSyncError] = useState<string | null>(null)

	// Load sync queue from localStorage on mount
	useEffect(() => {
		const savedQueue = localStorage.getItem(SYNC_QUEUE_KEY)
		if (savedQueue) {
			setSyncQueue(JSON.parse(savedQueue))
		}
	}, [])

	// Save sync queue to localStorage whenever it changes
	useEffect(() => {
		localStorage.setItem(SYNC_QUEUE_KEY, JSON.stringify(syncQueue))
	}, [syncQueue])

	const addToSyncQueue = useCallback(
		(operation: Omit<SyncOperation, "id" | "timestamp" | "retryCount">) => {
			const syncOp: SyncOperation = {
				...operation,
				id: crypto.randomUUID(),
				timestamp: Date.now(),
				retryCount: 0,
			}

			setSyncQueue((prev) => [...prev, syncOp])
		},
		[]
	)

	const removeFromSyncQueue = useCallback((operationId: string) => {
		setSyncQueue((prev) => prev.filter((op) => op.id !== operationId))
	}, [])

	const processSyncQueue = useCallback(async (): Promise<boolean> => {
		if (syncQueue.length === 0) return true

		setIsSyncing(true)
		setSyncError(null)

		const operationsToProcess = [...syncQueue]
		const failedOperations: SyncOperation[] = []

		for (const operation of operationsToProcess) {
			try {
				let success = false

				switch (operation.type) {
					case "insert": {
						if (operation.data) {
							const { error } = await supabase
								.from("todo")
								.insert([operation.data as TablesInsert<"todo">])
							success = !error
							if (error) console.error("Sync insert error:", error)
						}
						break
					}

					case "update": {
						if (operation.data) {
							const { error } = await supabase
								.from("todo")
								.update(operation.data as TablesUpdate<"todo">)
								.eq("id", operation.todoId)
							success = !error
							if (error) console.error("Sync update error:", error)
						}
						break
					}

					case "delete": {
						const { error } = await supabase
							.from("todo")
							.delete()
							.eq("id", operation.todoId)
						success = !error
						if (error) console.error("Sync delete error:", error)
						break
					}
				}

				if (success) {
					// Remove successful operation from queue
					removeFromSyncQueue(operation.id)
				} else {
					// Increment retry count
					const updatedOperation = {
						...operation,
						retryCount: operation.retryCount + 1,
					}

					if (updatedOperation.retryCount >= MAX_RETRY_COUNT) {
						// Remove operations that have exceeded retry limit
						removeFromSyncQueue(operation.id)
						console.warn(
							`Operation ${operation.id} failed after ${MAX_RETRY_COUNT} retries`
						)
					} else {
						failedOperations.push(updatedOperation)
					}
				}
			} catch (error) {
				console.error("Sync operation error:", error)
				failedOperations.push({
					...operation,
					retryCount: operation.retryCount + 1,
				})
			}
		}

		// Update queue with failed operations
		if (failedOperations.length > 0) {
			setSyncQueue(
				failedOperations.filter((op) => op.retryCount < MAX_RETRY_COUNT)
			)
			setSyncError(`Failed to sync ${failedOperations.length} operations`)
		}

		setIsSyncing(false)
		return failedOperations.length === 0
	}, [syncQueue, removeFromSyncQueue])

	const clearSyncQueue = useCallback(() => {
		setSyncQueue([])
		setSyncError(null)
	}, [])

	return {
		syncQueue,
		isSyncing,
		syncError,
		pendingOperationsCount: syncQueue.length,
		addToSyncQueue,
		removeFromSyncQueue,
		processSyncQueue,
		clearSyncQueue,
	}
}
