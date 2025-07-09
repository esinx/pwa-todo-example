import { useState } from "react"
import { Trash2, Edit3, Check, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import type { Tables } from "@/types/supabase-types"

interface TodoItemProps {
	todo: Tables<"todo">
	onToggle: (id: string) => void
	onUpdate: (id: string, updates: { title?: string }) => void
	onDelete: (id: string) => void
}

export function TodoItem({
	todo,
	onToggle,
	onUpdate,
	onDelete,
}: TodoItemProps) {
	const [isEditing, setIsEditing] = useState(false)
	const [editTitle, setEditTitle] = useState(todo.title)

	const handleSave = () => {
		onUpdate(todo.id, {
			title: editTitle,
		})
		setIsEditing(false)
	}

	const handleCancel = () => {
		setEditTitle(todo.title)
		setIsEditing(false)
	}

	return (
		<div
			className={cn(
				"group p-4 border rounded-lg transition-all duration-200 hover:shadow-md",
				todo.complete
					? "bg-gray-50 border-gray-200"
					: "bg-white border-gray-300"
			)}>
			<div className="flex items-start gap-3">
				<button
					onClick={() => onToggle(todo.id)}
					className={cn(
						"mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors",
						todo.complete
							? "bg-green-500 border-green-500 text-white"
							: "border-gray-300 hover:border-green-500"
					)}>
					{todo.complete && <Check className="w-3 h-3" />}
				</button>

				<div className="flex-1 min-w-0">
					{isEditing ? (
						<div className="space-y-3">
							<Input
								value={editTitle}
								onChange={(e) => setEditTitle(e.target.value)}
								placeholder="Todo title"
								className="font-medium"
							/>
							<div className="flex gap-2">
								<Button size="sm" onClick={handleSave}>
									<Check className="w-4 h-4" />
									Save
								</Button>
								<Button size="sm" variant="outline" onClick={handleCancel}>
									<X className="w-4 h-4" />
									Cancel
								</Button>
							</div>
						</div>
					) : (
						<div>
							<h3
								className={cn(
									"font-medium text-gray-900 break-words",
									todo.complete && "line-through text-gray-500"
								)}>
								{todo.title}
							</h3>
							<p className="mt-2 text-xs text-gray-400">
								{new Date(todo.created_at).toLocaleDateString()}
							</p>
						</div>
					)}
				</div>

				{!isEditing && (
					<div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
						<Button
							size="sm"
							variant="ghost"
							onClick={() => setIsEditing(true)}
							className="h-8 w-8 p-0">
							<Edit3 className="w-4 h-4" />
						</Button>
						<Button
							size="sm"
							variant="ghost"
							onClick={() => onDelete(todo.id)}
							className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
							<Trash2 className="w-4 h-4" />
						</Button>
					</div>
				)}
			</div>
		</div>
	)
}
