import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type CategoryId = bigint;
export interface Category {
    id: CategoryId;
    name: string;
    color: string;
}
export type TodoItemId = bigint;
export interface TodoItem {
    id: TodoItemId;
    categoryId: CategoryId;
    text: string;
    completed: boolean;
    timestamp: bigint;
}
export interface backendInterface {
    createCategory(name: string, color: string): Promise<CategoryId>;
    createTodoItem(text: string, categoryId: CategoryId): Promise<TodoItemId>;
    deleteCategory(id: CategoryId): Promise<void>;
    deleteTodoItem(id: TodoItemId): Promise<void>;
    getAllCategories(): Promise<Array<Category>>;
    getAllTodoItems(): Promise<Array<TodoItem>>;
    getTodosByCategory(categoryId: CategoryId): Promise<Array<TodoItem>>;
    toggleTodoCompleted(id: TodoItemId): Promise<void>;
    updateCategory(id: CategoryId, newName: string, newColor: string): Promise<void>;
    updateTodoItemText(id: TodoItemId, newText: string): Promise<void>;
}
