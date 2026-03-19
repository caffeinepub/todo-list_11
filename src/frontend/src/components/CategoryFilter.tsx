import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetAllCategories, useGetAllTodos } from "@/hooks/useQueries";
import type { CategoryId } from "@/backend";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategoryId: CategoryId | "all";
  onCategoryChange: (categoryId: CategoryId | "all") => void;
}

export function CategoryFilter({ selectedCategoryId, onCategoryChange }: CategoryFilterProps) {
  const { data: categories } = useGetAllCategories();
  const { data: todos } = useGetAllTodos();

  const getTodoCount = (categoryId: CategoryId | "all") => {
    if (!todos) return 0;
    if (categoryId === "all") return todos.length;
    return todos.filter((t) => t.categoryId === categoryId).length;
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        variant={selectedCategoryId === "all" ? "default" : "outline"}
        onClick={() => onCategoryChange("all")}
        className={cn(
          "border-2 font-medium transition-all",
          selectedCategoryId === "all"
            ? "bg-primary text-primary-foreground hover:bg-accent"
            : "hover:border-primary hover:bg-secondary"
        )}
      >
        All
        <Badge
          variant="secondary"
          className={cn(
            "ml-2",
            selectedCategoryId === "all" ? "bg-primary-foreground/20" : "bg-muted"
          )}
        >
          {getTodoCount("all")}
        </Badge>
      </Button>
      {categories?.map((category) => (
        <Button
          key={String(category.id)}
          variant={selectedCategoryId === category.id ? "default" : "outline"}
          onClick={() => onCategoryChange(category.id)}
          className={cn(
            "border-2 font-medium transition-all",
            selectedCategoryId === category.id
              ? "text-white hover:opacity-90"
              : "hover:border-primary hover:bg-secondary"
          )}
          style={
            selectedCategoryId === category.id
              ? { backgroundColor: category.color, borderColor: category.color }
              : {}
          }
        >
          {category.name}
          <Badge
            variant="secondary"
            className={cn(
              "ml-2",
              selectedCategoryId === category.id ? "bg-white/20 text-white" : "bg-muted"
            )}
          >
            {getTodoCount(category.id)}
          </Badge>
        </Button>
      ))}
    </div>
  );
}
