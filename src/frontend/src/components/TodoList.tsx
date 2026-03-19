import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { useGetAllTodos, useGetAllCategories } from "@/hooks/useQueries";
import { TodoItemComponent } from "./TodoItem";
import { AddTodoForm } from "./AddTodoForm";
import { CategoryFilter } from "./CategoryFilter";
import { CategoryManager } from "./CategoryManager";
import { Skeleton } from "@/components/ui/skeleton";
import type { CategoryId } from "@/backend";

export function TodoList() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId | "all">("all");
  const { data: todos, isLoading, isError } = useGetAllTodos();
  const { data: categories } = useGetAllCategories();

  // Filter todos by selected category
  const filteredTodos =
    selectedCategoryId === "all"
      ? todos
      : todos?.filter((t) => t.categoryId === selectedCategoryId);

  // Calculate completion stats for filtered todos
  const totalTodos = filteredTodos?.length || 0;
  const completedTodos = filteredTodos?.filter((t) => t.completed).length || 0;
  const completionPercentage = totalTodos > 0 ? (completedTodos / totalTodos) * 100 : 0;

  // Sort todos: incomplete first, then completed
  const sortedTodos = [...(filteredTodos || [])].sort((a, b) => {
    if (a.completed === b.completed) {
      return Number(b.timestamp - a.timestamp); // Newer first
    }
    return a.completed ? 1 : -1; // Incomplete first
  });

  // Helper to get category for a todo
  const getCategoryForTodo = (categoryId: CategoryId) => {
    return categories?.find((c) => c.id === categoryId);
  };

  return (
    <div className="relative min-h-screen">
      {/* Vertical progress bar - signature detail */}
      <div className="fixed left-0 top-0 bottom-0 w-1 bg-secondary z-50">
        <div
          className="bg-primary transition-all duration-500 ease-out w-full"
          style={{ height: `${completionPercentage}%` }}
        />
      </div>

      {/* Main content */}
      <div className="max-w-3xl mx-auto px-6 py-12 pl-10">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h1 className="font-display text-5xl font-bold tracking-tight">Todo List</h1>
            <CategoryManager />
          </div>
          <div className="flex items-center gap-3 text-muted-foreground">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <p className="text-base font-medium">
              {completedTodos} of {totalTodos} tasks completed
              {totalTodos > 0 && (
                <span className="ml-2 text-primary font-bold">
                  ({Math.round(completionPercentage)}%)
                </span>
              )}
            </p>
          </div>
        </header>

        {/* Category filter */}
        <CategoryFilter
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={setSelectedCategoryId}
        />

        {/* Add todo form */}
        <div className="mb-8">
          <AddTodoForm />
        </div>

        {/* Todo list */}
        <div className="space-y-3">
          {isLoading ? (
            // Loading skeleton
            <>
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-4 bg-card border-2 border-border">
                  <Skeleton className="h-6 w-full" />
                </div>
              ))}
            </>
          ) : isError ? (
            // Error state
            <div className="text-center py-12 px-4 bg-destructive/10 border-2 border-destructive">
              <p className="text-destructive font-medium">
                Failed to load todos. Please try again.
              </p>
            </div>
          ) : sortedTodos.length === 0 ? (
            // Empty state
            <div className="text-center py-16 px-4 bg-muted/20 border-2 border-dashed border-muted">
              <CheckCircle2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-display text-xl font-bold mb-2">No tasks yet</h3>
              <p className="text-muted-foreground">
                Add your first task above to get started
              </p>
            </div>
          ) : (
            // Todo items
            sortedTodos.map((todo) => (
              <TodoItemComponent
                key={String(todo.id)}
                todo={todo}
                category={getCategoryForTodo(todo.categoryId)}
              />
            ))
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t-2 border-border text-center text-sm text-muted-foreground">
          © 2026. Built with{" "}
          <span className="text-primary">❤</span>{" "}
          using{" "}
          <a
            href="https://caffeine.ai"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline font-medium"
          >
            caffeine.ai
          </a>
        </footer>
      </div>
    </div>
  );
}
