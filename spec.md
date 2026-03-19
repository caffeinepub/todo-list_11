# Todo List

## Current State

The app is a red-themed todo list with:
- Backend: TodoItem model with id, text, completed, timestamp
- Frontend: TodoList component displaying all todos sorted by completion status
- UI: Vertical progress bar on left edge tracking completion percentage
- Features: Create, update, toggle completion, delete todos

## Requested Changes (Diff)

### Add
- Category management: Users can create, rename, and delete categories
- Todo-category assignment: Each todo belongs to one category (default: "Uncategorized")
- Category filtering: View todos by category or view all
- Category selector in add todo form: Choose category when creating a new todo

### Modify
- Backend TodoItem: Add categoryId field
- Backend: New Category type with id, name, color
- Backend: CRUD operations for categories
- Frontend TodoList: Add category filter UI (tabs or dropdown)
- Frontend: Display category badge/indicator on each todo item
- Frontend AddTodoForm: Add category selector dropdown

### Remove
- Nothing

## Implementation Plan

1. Backend: Add Category type and CRUD operations (createCategory, getAllCategories, updateCategoryName, deleteCategory)
2. Backend: Modify TodoItem to include categoryId field, add default "Uncategorized" category
3. Backend: Add method to get todos by category
4. Frontend: Update TodoList to show category filter tabs/buttons
5. Frontend: Update TodoItem to display category badge
6. Frontend: Update AddTodoForm to include category selector
7. Frontend: Add category management UI (create/edit/delete categories)

## UX Notes

- Keep the red theme consistent across new UI elements
- Category colors can be predefined or user-selectable
- Default category "Uncategorized" for existing and new todos without explicit category
- Category filter should be prominent but not overwhelm the minimal design
- Progress bar should reflect filtered view when category is selected
