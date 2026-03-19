import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import {
  useGetAllCategories,
  useCreateCategory,
  useUpdateCategory,
  useDeleteCategory,
} from "@/hooks/useQueries";
import type { Category, CategoryId } from "@/backend";

const PRESET_COLORS = [
  { name: "Crimson", value: "#C41E3A" },
  { name: "Vermillion", value: "#E34234" },
  { name: "Coral", value: "#FF6B6B" },
  { name: "Rose", value: "#FF8FA3" },
  { name: "Wine", value: "#722F37" },
  { name: "Charcoal", value: "#36454F" },
  { name: "Slate", value: "#708090" },
  { name: "Steel", value: "#4682B4" },
];

export function CategoryManager() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<CategoryId | null>(null);
  const [newName, setNewName] = useState("");
  const [newColor, setNewColor] = useState(PRESET_COLORS[0].value);

  const { data: categories } = useGetAllCategories();
  const createMutation = useCreateCategory();
  const updateMutation = useUpdateCategory();
  const deleteMutation = useDeleteCategory();

  const isUncategorized = (id: CategoryId) => id === 0n;

  const handleCreate = () => {
    if (newName.trim()) {
      createMutation.mutate(
        { name: newName.trim(), color: newColor },
        {
          onSuccess: () => {
            setNewName("");
            setNewColor(PRESET_COLORS[0].value);
          },
        }
      );
    }
  };

  const handleUpdate = (id: CategoryId, name: string, color: string) => {
    updateMutation.mutate({ id, newName: name, newColor: color });
    setEditingId(null);
  };

  const handleDelete = (id: CategoryId) => {
    if (confirm("Delete this category? All tasks will be moved to Uncategorized.")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-2 hover:border-primary hover:bg-secondary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Manage Categories
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Category Management</DialogTitle>
          <DialogDescription>
            Create and organize categories for your tasks
          </DialogDescription>
        </DialogHeader>

        {/* Create new category */}
        <div className="border-2 border-border p-4 bg-muted/20 space-y-3">
          <h3 className="font-display font-bold text-sm">Create New Category</h3>
          <div className="flex gap-2">
            <Input
              placeholder="Category name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 border-2"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            />
            <select
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              className="border-2 border-input bg-background px-3 py-2 text-sm rounded-md"
              style={{ color: newColor }}
            >
              {PRESET_COLORS.map((c) => (
                <option key={c.value} value={c.value} style={{ color: c.value }}>
                  {c.name}
                </option>
              ))}
            </select>
            <Button
              onClick={handleCreate}
              disabled={!newName.trim() || createMutation.isPending}
              className="bg-primary hover:bg-accent"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Existing categories */}
        <div className="space-y-2">
          <h3 className="font-display font-bold text-sm">Existing Categories</h3>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {categories?.map((category) => (
              <CategoryRow
                key={String(category.id)}
                category={category}
                isEditing={editingId === category.id}
                onEdit={() => setEditingId(category.id)}
                onCancelEdit={() => setEditingId(null)}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
                isUncategorized={isUncategorized(category.id)}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface CategoryRowProps {
  category: Category;
  isEditing: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (id: CategoryId, name: string, color: string) => void;
  onDelete: (id: CategoryId) => void;
  isUncategorized: boolean;
}

function CategoryRow({
  category,
  isEditing,
  onEdit,
  onCancelEdit,
  onUpdate,
  onDelete,
  isUncategorized,
}: CategoryRowProps) {
  const [editName, setEditName] = useState(category.name);
  const [editColor, setEditColor] = useState(category.color);

  const handleSave = () => {
    if (editName.trim()) {
      onUpdate(category.id, editName.trim(), editColor);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-2 p-3 border-2 border-primary bg-card">
        <Input
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          className="flex-1 h-9 border-2"
          autoFocus
          onKeyDown={(e) => e.key === "Enter" && handleSave()}
        />
        <select
          value={editColor}
          onChange={(e) => setEditColor(e.target.value)}
          className="border-2 border-input bg-background px-2 py-1 text-sm rounded-md"
          style={{ color: editColor }}
        >
          {PRESET_COLORS.map((c) => (
            <option key={c.value} value={c.value} style={{ color: c.value }}>
              {c.name}
            </option>
          ))}
        </select>
        <Button size="icon" variant="ghost" onClick={handleSave} className="h-9 w-9">
          <Plus className="h-4 w-4 rotate-45" />
        </Button>
        <Button
          size="icon"
          variant="ghost"
          onClick={onCancelEdit}
          className="h-9 w-9 hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 p-3 border-2 border-border bg-card hover:border-primary/50 transition-colors">
      <Badge
        className="font-medium"
        style={{
          backgroundColor: category.color,
          color: "#ffffff",
        }}
      >
        {category.name}
      </Badge>
      <span className="text-sm text-muted-foreground flex-1">
        {isUncategorized && "(Default)"}
      </span>
      {!isUncategorized && (
        <div className="flex gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={onEdit}
            className="h-8 w-8 hover:bg-secondary"
          >
            <Pencil className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => onDelete(category.id)}
            className="h-8 w-8 hover:bg-destructive hover:text-destructive-foreground"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
