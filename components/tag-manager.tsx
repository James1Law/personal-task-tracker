"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Edit, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import type { Tag } from "@/types/kanban"

interface TagManagerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  tags: Tag[]
  selectedTags: string[]
  onSelectedTagsChange: (tags: string[]) => void
  onAddTag: (tag: Omit<Tag, "id">) => void
  onUpdateTag: (tag: Tag) => void
  onDeleteTag: (tagId: string) => void
}

export function TagManager({
  open,
  onOpenChange,
  tags,
  selectedTags,
  onSelectedTagsChange,
  onAddTag,
  onUpdateTag,
  onDeleteTag,
}: TagManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [newTagName, setNewTagName] = useState("")
  const [newTagColor, setNewTagColor] = useState("#3b82f6")

  const colors = [
    "#ef4444",
    "#f97316",
    "#eab308",
    "#22c55e",
    "#10b981",
    "#06b6d4",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
  ]

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (newTagName.trim()) {
      onAddTag({
        name: newTagName.trim(),
        color: newTagColor,
      })
      setNewTagName("")
      setNewTagColor("#3b82f6")
      setShowAddForm(false)
    }
  }

  const handleUpdateTag = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingTag && newTagName.trim()) {
      onUpdateTag({
        ...editingTag,
        name: newTagName.trim(),
        color: newTagColor,
      })
      setEditingTag(null)
      setNewTagName("")
      setNewTagColor("#3b82f6")
    }
  }

  const startEditing = (tag: Tag) => {
    setEditingTag(tag)
    setNewTagName(tag.name)
    setNewTagColor(tag.color)
    setShowAddForm(false)
  }

  const cancelEditing = () => {
    setEditingTag(null)
    setNewTagName("")
    setNewTagColor("#3b82f6")
  }

  const toggleTagFilter = (tagId: string) => {
    onSelectedTagsChange(
      selectedTags.includes(tagId) ? selectedTags.filter((id) => id !== tagId) : [...selectedTags, tagId],
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Manage Tags</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Filter by Tags</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                  className="cursor-pointer"
                  style={{
                    backgroundColor: selectedTags.includes(tag.id) ? tag.color : "transparent",
                    borderColor: tag.color,
                    color: selectedTags.includes(tag.id) ? "white" : tag.color,
                  }}
                  onClick={() => toggleTagFilter(tag.id)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">All Tags</Label>
              <Button
                size="sm"
                onClick={() => {
                  setShowAddForm(true)
                  setEditingTag(null)
                }}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Tag
              </Button>
            </div>

            <div className="space-y-2">
              {tags.map((tag) => (
                <Card key={tag.id} className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tag.color }} />
                      <span className="font-medium">{tag.name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEditing(tag)}>
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-destructive hover:text-destructive"
                        onClick={() => onDeleteTag(tag.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {(showAddForm || editingTag) && (
            <Card className="p-4">
              <form onSubmit={editingTag ? handleUpdateTag : handleAddTag} className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">{editingTag ? "Edit Tag" : "Add New Tag"}</Label>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6"
                    onClick={() => {
                      setShowAddForm(false)
                      cancelEditing()
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>

                <div>
                  <Label htmlFor="tag-name" className="text-xs">
                    Name
                  </Label>
                  <Input
                    id="tag-name"
                    value={newTagName}
                    onChange={(e) => setNewTagName(e.target.value)}
                    placeholder="Tag name..."
                    className="h-8"
                  />
                </div>

                <div>
                  <Label className="text-xs">Color</Label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`w-6 h-6 rounded-full border-2 ${
                          newTagColor === color ? "border-foreground" : "border-transparent"
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setNewTagColor(color)}
                      />
                    ))}
                  </div>
                </div>

                <Button type="submit" size="sm" disabled={!newTagName.trim()}>
                  {editingTag ? "Update" : "Add"} Tag
                </Button>
              </form>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
