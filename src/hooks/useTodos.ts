import { useState, useEffect } from "react"
import { supabase } from "@/core/supabase"
import type { Tables, TablesInsert, TablesUpdate } from "@/types/supabase-types"
import { useOnlineStatus } from "./useOnlineStatus"
import { useSyncQueue } from "./useSyncQueue"

export function useTodos() {
	const [todos, setTodos] = useState<Tables<"todo">[]>([])
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	const isOnline = useOnlineStatus()
	const {
		addToSyncQueue,
		processSyncQueue,
		isSyncing,
		syncError,
		pendingOperationsCount,
	} = useSyncQueue()

	// Load todos from localStorage on mount (offline support)
	useEffect(() => {
		const cachedTodos = localStorage.getItem("todos")
		if (cachedTodos) {
			setTodos(JSON.parse(cachedTodos))
		}
		fetchTodos()
	}, [])

	// Cache todos in localStorage whenever todos change
	useEffect(() => {
		localStorage.setItem("todos", JSON.stringify(todos))
	}, [todos])

	// Auto-sync when coming back online
	useEffect(() => {
		if (isOnline && pendingOperationsCount > 0) {
			console.log("Coming back online, processing sync queue...")
			processSyncQueue().then((success) => {
				if (success) {
					console.log("All operations synced successfully")
					// Refresh todos after successful sync
					fetchTodos()
				}
			})
		}
	}, [isOnline, pendingOperationsCount, processSyncQueue])

	const fetchTodos = async () => {
		try {
			setLoading(true)
			const { data, error } = await supabase
				.from("todo")
				.select("*")
				.order("created_at", { ascending: false })

			if (error) throw error

			setTodos(data || [])
			setError(null)
		} catch (err) {
			console.error("Error fetching todos:", err)
			setError("Failed to fetch todos")
			// Keep cached todos if online fetch fails
		} finally {
			setLoading(false)
		}
	}

	const addTodo = async (
		todoData: Omit<TablesInsert<"todo">, "id" | "created_at">
	) => {
		try {
			const newTodo: Tables<"todo"> = {
				id: crypto.randomUUID(),
				created_at: new Date().toISOString(),
				complete: false,
				title: todoData.title,
			}

			// Optimistically update local state
			setTodos((prev) => [newTodo, ...prev])

			if (isOnline) {
				// Try to sync with Supabase immediately if online
				const { error } = await supabase.from("todo").insert([newTodo])

				if (error) {
					console.error("Error adding todo to server:", error)
					// Add to sync queue if immediate sync fails
					addToSyncQueue({
						type: "insert",
						todoId: newTodo.id,
						data: newTodo,
					})
					setError("Todo added but failed to sync - will retry when connected")
				} else {
					setError(null)
				}
			} else {
				// Add to sync queue if offline
				addToSyncQueue({
					type: "insert",
					todoId: newTodo.id,
					data: newTodo,
				})
				setError("Todo added offline - will sync when connected")
			}
		} catch (err) {
			console.error("Error adding todo:", err)
			setError("Failed to add todo")
		}
	}

	const updateTodo = async (id: string, updates: TablesUpdate<"todo">) => {
		try {
			// Optimistically update local state
			setTodos((prev) =>
				prev.map((todo) => (todo.id === id ? { ...todo, ...updates } : todo))
			)

			if (isOnline) {
				// Try to sync with Supabase immediately if online
				const { error } = await supabase
					.from("todo")
					.update(updates)
					.eq("id", id)

				if (error) {
					console.error("Error updating todo on server:", error)
					// Add to sync queue if immediate sync fails
					addToSyncQueue({
						type: "update",
						todoId: id,
						data: updates,
					})
					setError(
						"Todo updated but failed to sync - will retry when connected"
					)
				} else {
					setError(null)
				}
			} else {
				// Add to sync queue if offline
				addToSyncQueue({
					type: "update",
					todoId: id,
					data: updates,
				})
				setError("Todo updated offline - will sync when connected")
			}
		} catch (err) {
			console.error("Error updating todo:", err)
			setError("Failed to update todo")
		}
	}

	const deleteTodo = async (id: string) => {
		try {
			// Optimistically update local state
			setTodos((prev) => prev.filter((todo) => todo.id !== id))

			if (isOnline) {
				// Try to sync with Supabase immediately if online
				const { error } = await supabase.from("todo").delete().eq("id", id)

				if (error) {
					console.error("Error deleting todo from server:", error)
					// Add to sync queue if immediate sync fails
					addToSyncQueue({
						type: "delete",
						todoId: id,
					})
					setError(
						"Todo deleted but failed to sync - will retry when connected"
					)
				} else {
					setError(null)
				}
			} else {
				// Add to sync queue if offline
				addToSyncQueue({
					type: "delete",
					todoId: id,
				})
				setError("Todo deleted offline - will sync when connected")
			}
		} catch (err) {
			console.error("Error deleting todo:", err)
			setError("Failed to delete todo")
		}
	}

	const toggleTodo = async (id: string) => {
		const todo = todos.find((t) => t.id === id)
		if (todo) {
			await updateTodo(id, { complete: !todo.complete })
		}
	}

	const manualSync = async (): Promise<boolean> => {
		if (!isOnline || pendingOperationsCount === 0) {
			return true
		}

		const success = await processSyncQueue()
		if (success) {
			// Refresh todos after successful sync
			await fetchTodos()
		}
		return success
	}

	return {
		todos,
		loading,
		error: error || syncError,
		addTodo,
		updateTodo,
		deleteTodo,
		toggleTodo,
		refetch: fetchTodos,
		manualSync,
		isOnline,
		isSyncing,
		pendingOperationsCount,
	}
}
