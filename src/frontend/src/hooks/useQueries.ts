import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useActor } from "./useActor";
import { toast } from "sonner";
import type { TodoItem, TodoItemId, Category, CategoryId } from "@/backend";

// Query: Get all todos
export function useGetAllTodos() {
  const { actor, isFetching } = useActor();
  return useQuery<TodoItem[]>({
    queryKey: ["todos"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllTodoItems();
    },
    enabled: !!actor && !isFetching,
  });
}

// Mutation: Create new todo
export function useCreateTodo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ text, categoryId }: { text: string; categoryId: CategoryId }) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.createTodoItem(text, categoryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Task added successfully");
    },
    onError: () => {
      toast.error("Failed to add task");
    },
  });
}

// Mutation: Toggle todo completion
export function useToggleTodo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: TodoItemId) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.toggleTodoCompleted(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });
}

// Mutation: Update todo text
export function useUpdateTodoText() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, newText }: { id: TodoItemId; newText: string }) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.updateTodoItemText(id, newText);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Task updated successfully");
    },
    onError: () => {
      toast.error("Failed to update task");
    },
  });
}

// Mutation: Delete todo
export function useDeleteTodo() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: TodoItemId) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.deleteTodoItem(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Task deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete task");
    },
  });
}

// ============= CATEGORY QUERIES =============

// Query: Get all categories
export function useGetAllCategories() {
  const { actor, isFetching } = useActor();
  return useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCategories();
    },
    enabled: !!actor && !isFetching,
  });
}

// Mutation: Create new category
export function useCreateCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ name, color }: { name: string; color: string }) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.createCategory(name, color);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category created successfully");
    },
    onError: () => {
      toast.error("Failed to create category");
    },
  });
}

// Mutation: Update category
export function useUpdateCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      newName,
      newColor,
    }: {
      id: CategoryId;
      newName: string;
      newColor: string;
    }) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.updateCategory(id, newName, newColor);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      toast.success("Category updated successfully");
    },
    onError: () => {
      toast.error("Failed to update category");
    },
  });
}

// Mutation: Delete category
export function useDeleteCategory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: CategoryId) => {
      if (!actor) throw new Error("Actor not initialized");
      await actor.deleteCategory(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["todos"] });
      toast.success("Category deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete category");
    },
  });
}
