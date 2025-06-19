"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { format, addDays } from "date-fns"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { Card } from "@/types/kanban"

interface ExtendDueDateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  card: Card | null
  onUpdateCard: (card: Card) => void
}

export function ExtendDueDateDialog({ open, onOpenChange, card, onUpdateCard }: ExtendDueDateDialogProps) {
  const [newDueDate, setNewDueDate] = useState("")

  useEffect(() => {
    if (card?.dueDate) {
      // Default to 1 week from original due date
      const originalDate = new Date(card.dueDate)
      const extendedDate = addDays(originalDate, 7)
      setNewDueDate(format(extendedDate, "yyyy-MM-dd"))
    }
  }, [card])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (card && newDueDate) {
      onUpdateCard({
        ...card,
        dueDate: newDueDate,
        overdueAcknowledged: false, // Reset acknowledgment when extending
      })
      onOpenChange(false)
    }
  }

  const quickExtendOptions = [
    { label: "Tomorrow", days: 1 },
    { label: "3 days", days: 3 },
    { label: "1 week", days: 7 },
    { label: "2 weeks", days: 14 },
  ]

  const handleQuickExtend = (days: number) => {
    if (card?.dueDate) {
      const originalDate = new Date(card.dueDate)
      const extendedDate = addDays(originalDate, days)
      setNewDueDate(format(extendedDate, "yyyy-MM-dd"))
    }
  }

  if (!card) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Extend Due Date</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium">{card.title}</p>
            <p className="text-xs text-muted-foreground">
              Current due date: {card.dueDate ? format(new Date(card.dueDate), "MMM d, yyyy") : "None"}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium">Quick extend options</Label>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {quickExtendOptions.map((option) => (
                <Button
                  key={option.days}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickExtend(option.days)}
                  type="button"
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="new-due-date">New Due Date</Label>
              <Input
                id="new-due-date"
                type="date"
                value={newDueDate}
                onChange={(e) => setNewDueDate(e.target.value)}
                min={format(new Date(), "yyyy-MM-dd")}
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!newDueDate}>
                Extend Due Date
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
