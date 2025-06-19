"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import type { Card, Tag } from "@/types/kanban"

interface AddCardDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAddCard: (card: Omit<Card, "id" | "createdAt">) => void
  availableTags: Tag[]
}

export function AddCardDialog({ open, onOpenChange, onAddCard, availableTags }: AddCardDialogProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [dueDate, setDueDate] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (title.trim()) {
      onAddCard({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        dueDate: dueDate || undefined,
        tags: selectedTags,
      })

      // Reset form
      setTitle("")
      setDescription("")
      setPriority("medium")
      setDueDate("")
      setSelectedTags([])
      onOpenChange(false)
    }
  }

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) => (prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="card-title">Title</Label>
            <Input
              id="card-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter card title..."
              autoFocus
            />
          </div>

          <div>
            <Label htmlFor="card-description">Description</Label>
            <Textarea
              id="card-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter card description..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="card-priority">Priority</Label>
            <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="card-due-date">Due Date</Label>
            <Input id="card-due-date" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>

          {availableTags.length > 0 && (
            <div>
              <Label>Tags</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {availableTags.map((tag) => (
                  <div key={tag.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`tag-${tag.id}`}
                      checked={selectedTags.includes(tag.id)}
                      onCheckedChange={() => toggleTag(tag.id)}
                    />
                    <Label
                      htmlFor={`tag-${tag.id}`}
                      className="text-sm font-normal cursor-pointer"
                      style={{ color: tag.color }}
                    >
                      {tag.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={!title.trim()}>
              Add Card
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
