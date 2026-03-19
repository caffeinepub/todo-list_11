import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Time "mo:core/Time";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Migration "migration";

(with migration = Migration.run)
actor {
  // --- 1. Type Declarations ---
  type TodoItemId = Nat;
  type CategoryId = Nat;

  type TodoItem = {
    id : TodoItemId;
    text : Text;
    completed : Bool;
    timestamp : Int;
    categoryId : CategoryId;
  };

  type Category = {
    id : CategoryId;
    name : Text;
    color : Text;
  };

  module TodoItem {
    public func compareByTimestamp(todo1 : TodoItem, todo2 : TodoItem) : Order.Order {
      Int.compare(todo2.timestamp, todo1.timestamp);
    };
  };

  module Category {
    public func compareById(cat1 : Category, cat2 : Category) : Order.Order {
      Nat.compare(cat1.id, cat2.id);
    };
  };

  // --- 2. Persistent Data Structures ---
  let todoItems = Map.empty<TodoItemId, TodoItem>();
  let categories = Map.empty<CategoryId, Category>();

  var nextTodoId = 0;
  var nextCategoryId = 1; // 0 is reserved for "Uncategorized"

  // --- 3. Category Management ---
  public shared ({ caller }) func createCategory(name : Text, color : Text) : async CategoryId {
    let id = nextCategoryId;
    nextCategoryId += 1;

    let category : Category = {
      id;
      name;
      color;
    };

    categories.add(id, category);
    id;
  };

  public query ({ caller }) func getAllCategories() : async [Category] {
    categories.values().toArray().sort(Category.compareById);
  };

  public shared ({ caller }) func updateCategory(id : CategoryId, newName : Text, newColor : Text) : async () {
    switch (categories.get(id)) {
      case (null) { Runtime.trap("Category not found") };
      case (?category) {
        let updatedCategory = {
          category with
          name = newName;
          color = newColor;
        };
        categories.add(id, updatedCategory);
      };
    };
  };

  public shared ({ caller }) func deleteCategory(id : CategoryId) : async () {
    if (id == 0) {
      Runtime.trap("Cannot delete the Uncategorized category");
    };

    if (not categories.containsKey(id)) {
      Runtime.trap("Category not found");
    };

    categories.remove(id);

    // Reassign todos to "Uncategorized"
    for ((todoId, todo) in todoItems.entries()) {
      if (todo.categoryId == id) {
        let updatedTodo = { todo with categoryId = 0 };
        todoItems.add(todoId, updatedTodo);
      };
    };
  };

  // --- 4. Todo Management ---
  public shared ({ caller }) func createTodoItem(text : Text, categoryId : CategoryId) : async TodoItemId {
    if (categoryId != 0 and not categories.containsKey(categoryId)) {
      Runtime.trap("Category not found");
    };

    let id = nextTodoId;
    nextTodoId += 1;

    let todoItem : TodoItem = {
      id;
      text;
      completed = false;
      timestamp = Time.now();
      categoryId;
    };

    todoItems.add(id, todoItem);
    id;
  };

  public query ({ caller }) func getAllTodoItems() : async [TodoItem] {
    todoItems.values().toArray().sort(TodoItem.compareByTimestamp);
  };

  public query ({ caller }) func getTodosByCategory(categoryId : CategoryId) : async [TodoItem] {
    todoItems.values().toArray().filter(
      func(todo) { todo.categoryId == categoryId }
    ).sort(TodoItem.compareByTimestamp);
  };

  public shared ({ caller }) func updateTodoItemText(id : TodoItemId, newText : Text) : async () {
    switch (todoItems.get(id)) {
      case (null) { Runtime.trap("Todo item not found") };
      case (?todoItem) {
        let updatedItem = { todoItem with text = newText };
        todoItems.add(id, updatedItem);
      };
    };
  };

  public shared ({ caller }) func toggleTodoCompleted(id : TodoItemId) : async () {
    switch (todoItems.get(id)) {
      case (null) { Runtime.trap("Todo item not found") };
      case (?todoItem) {
        let updatedItem = {
          todoItem with completed = not todoItem.completed
        };
        todoItems.add(id, updatedItem);
      };
    };
  };

  public shared ({ caller }) func deleteTodoItem(id : TodoItemId) : async () {
    if (not todoItems.containsKey(id)) {
      Runtime.trap("Todo item not found");
    };
    todoItems.remove(id);
  };
};
