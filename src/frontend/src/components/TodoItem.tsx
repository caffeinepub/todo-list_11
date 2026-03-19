import { useState } from "react";
import { Trash2, Edit2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TodoItem, Category } from "@/backend";
import { useToggleTodo, useUpdateTodoText, useDeleteTodo } from "@/hooks/useQueries";

interface TodoItemProps {
  todo: TodoItem;
  category?: Category;
}

export function TodoItemComponent({ todo, category }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const toggleMutation = useToggleTodo();
  const updateMutation = useUpdateTodoText();
  const deleteMutation = useDeleteTodo();

  const handleToggle = () => {
    toggleMutation.mutate(todo.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditText(todo.text);
  };

  const handleSave = () => {
    if (editText.trim() && editText !== todo.text) {
      updateMutation.mutate({ id: todo.id, newText: editText.trim() });
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleDelete = () => {
    deleteMutation.mutate(todo.id);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  return (
    <div
      className={cn(
        "group relative flex items-start gap-4 p-4 bg-card border-2 border-border transition-all duration-200",
        "hover:border-primary hover:shadow-sharp-sm",
        todo.completed && "bg-completed/20 border-completed"
      )}
    >
      {/* Checkbox */}
      <div className="flex items-center pt-1">
        <Checkbox
          checked={todo.completed}
          onCheckedChange={handleToggle}
          disabled={toggleMutation.isPending}
          className={cn(
            "h-5 w-5 border-2 transition-all duration-200",
            todo.completed && "bg-primary border-primary"
          )}
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="flex gap-2">
            <Input
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              className="font-medium border-2 border-primary focus-visible:ring-primary"
              autoFocus
              disabled={updateMutation.isPending}
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={handleSave}
              disabled={updateMutation.isPending || !editText.trim()}
              className="shrink-0 hover:bg-primary hover:text-primary-foreground"
            >
              <Check className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={handleCancel}
              disabled={updateMutation.isPending}
              className="shrink-0 hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <p
              className={cn(
                "font-medium text-base leading-relaxed break-words",
                todo.completed && "line-through text-completed-foreground"
              )}
            >
              {todo.text}
            </p>
            {category && (
              <Badge
                className="text-xs font-medium"
                style={{
                  backgroundColor: category.color,
                  color: "#ffffff",
                }}
              >
                {category.name}
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      {!isEditing && (
        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            size="icon"
            variant="ghost"
            onClick={handleEdit}
            disabled={todo.completed}
            className="shrink-0 h-8 w-8 hover:bg-secondary hover:text-foreground"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
            className="shrink-0 h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
