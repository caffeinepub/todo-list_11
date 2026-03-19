import { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateTodo, useGetAllCategories } from "@/hooks/useQueries";
import type { CategoryId } from "@/backend";

export function AddTodoForm() {
  const [text, setText] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<CategoryId>(0n);
  const createMutation = useCreateTodo();
  const { data: categories } = useGetAllCategories();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      createMutation.mutate(
        { text: text.trim(), categoryId: selectedCategoryId },
        {
          onSuccess: () => {
            setText("");
            setSelectedCategoryId(0n);
          },
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What needs to be done?"
        className="flex-1 h-12 text-base border-2 focus-visible:border-primary focus-visible:ring-primary font-medium"
        disabled={createMutation.isPending}
      />
      <Select
        value={String(selectedCategoryId)}
        onValueChange={(value) => setSelectedCategoryId(BigInt(value))}
      >
        <SelectTrigger className="w-48 h-12 border-2 font-medium">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          {categories?.map((category) => (
            <SelectItem key={String(category.id)} value={String(category.id)}>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button
        type="submit"
        disabled={!text.trim() || createMutation.isPending}
        className="h-12 px-6 bg-primary hover:bg-accent text-primary-foreground font-display font-bold tracking-wide transition-all duration-200"
      >
        {createMutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <Plus className="mr-2 h-5 w-5" />
            Add Task
          </>
        )}
      </Button>
    </form>
  );
}
