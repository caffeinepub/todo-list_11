import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import Int "mo:core/Int";

module {
  // Original types
  type OldTodoItem = {
    id : Nat;
    text : Text;
    completed : Bool;
    timestamp : Int;
  };

  type OldActor = {
    todoItems : Map.Map<Nat, OldTodoItem>;
    nextId : Nat;
  };

  // New types
  type NewTodoItem = {
    id : Nat;
    text : Text;
    completed : Bool;
    timestamp : Int;
    categoryId : Nat;
  };

  type Category = {
    id : Nat;
    name : Text;
    color : Text;
  };

  type NewActor = {
    todoItems : Map.Map<Nat, NewTodoItem>;
    categories : Map.Map<Nat, Category>;
    nextTodoId : Nat;
    nextCategoryId : Nat;
  };

  // Migration function
  public func run(old : OldActor) : NewActor {
    let newTodoItems = old.todoItems.map<Nat, OldTodoItem, NewTodoItem>(
      func(_id, oldTodo) {
        { oldTodo with categoryId = 0 }; // Assign all existing todos to Uncategorized
      }
    );

    let categories = Map.empty<Nat, Category>();
    categories.add(0, {
      id = 0;
      name = "Uncategorized";
      color = "#CCCCCC";
    });

    {
      todoItems = newTodoItems;
      categories;
      nextTodoId = old.nextId;
      nextCategoryId = 1; // Start after the default category
    };
  };
};
