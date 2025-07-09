import { useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AddTodoProps {
	onAdd: (todo: { title: string; description?: string }) => void
}

export function AddTodo({ onAdd }: AddTodoProps) {
	const [title, setTitle] = useState("")
	const [isExpanded, setIsExpanded] = useState(false)

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		if (!title.trim()) return

		onAdd({
			title: title.trim(),
		})

		setTitle("")
		setIsExpanded(false)
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-3">
			<div className="flex gap-2">
				<Input
					value={title}
					onChange={(e) => setTitle(e.target.value)}
					placeholder="Add a new todo..."
					onFocus={() => setIsExpanded(true)}
					className="flex-1"
				/>
				<Button type="submit" disabled={!title.trim()}>
					<Plus className="w-4 h-4" />
					Add
				</Button>
			</div>

			{isExpanded && (
				<div className="space-y-2">
					<div className="flex gap-2 justify-end">
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => {
								setIsExpanded(false)
							}}>
							Cancel
						</Button>
						<Button type="submit" size="sm" disabled={!title.trim()}>
							Add Todo
						</Button>
					</div>
				</div>
			)}
		</form>
	)
}
