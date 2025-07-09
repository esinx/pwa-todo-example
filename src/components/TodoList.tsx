import { useState } from "react"
import { TodoItem } from "./TodoItem"
import { Button } from "@/components/ui/button"
import type { Tables } from "@/types/supabase-types"

interface TodoListProps {
	todos: Tables<"todo">[]
	onToggle: (id: string) => void
	onUpdate: (id: string, updates: { title?: string }) => void
	onDelete: (id: string) => void
}

type FilterType = "all" | "active" | "completed"

export function TodoList({
	todos,
	onToggle,
	onUpdate,
	onDelete,
}: TodoListProps) {
	const [filter, setFilter] = useState<FilterType>("all")

	const filteredTodos = todos.filter((todo) => {
		switch (filter) {
			case "active":
				return !todo.complete
			case "completed":
				return todo.complete
			default:
				return true
		}
	})

	const completedCount = todos.filter((todo) => todo.complete).length
	const activeCount = todos.length - completedCount

	return (
		<div className="space-y-4">
			{/* Filter buttons */}
			<div className="flex gap-2 justify-center">
				<Button
					variant={filter === "all" ? "default" : "outline"}
					size="sm"
					onClick={() => setFilter("all")}>
					All ({todos.length})
				</Button>
				<Button
					variant={filter === "active" ? "default" : "outline"}
					size="sm"
					onClick={() => setFilter("active")}>
					Active ({activeCount})
				</Button>
				<Button
					variant={filter === "completed" ? "default" : "outline"}
					size="sm"
					onClick={() => setFilter("completed")}>
					Completed ({completedCount})
				</Button>
			</div>

			{/* Todo items */}
			<div className="space-y-3">
				{filteredTodos.length === 0 ? (
					<div className="text-center py-8 text-gray-500">
						{filter === "all" && "No todos yet. Add one above!"}
						{filter === "active" && "No active todos. Great job!"}
						{filter === "completed" && "No completed todos yet."}
					</div>
				) : (
					filteredTodos.map((todo) => (
						<TodoItem
							key={todo.id}
							todo={todo}
							onToggle={onToggle}
							onUpdate={onUpdate}
							onDelete={onDelete}
						/>
					))
				)}
			</div>
		</div>
	)
}
