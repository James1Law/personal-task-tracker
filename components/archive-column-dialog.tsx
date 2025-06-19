"use client"

import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import type { Column } from "@/types/kanban"

interface ArchiveColumnDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  column: Column | null
  onConfirm: () => void
}

export function ArchiveColumnDialog({ open, onOpenChange, column, onConfirm }: ArchiveColumnDialogProps) {
  if (!column) return null

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Archive All Cards
          </DialogTitle>
          <DialogDescription className="text-left">
            This will permanently delete all {column.cards.length} card{column.cards.length !== 1 ? "s" : ""} in the{" "}
            <span className="font-semibold">"{column.name}"</span> column.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {column.cards.length > 0 && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Cards to be deleted:</p>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {column.cards.map((card) => (
                  <div key={card.id} className="text-xs text-muted-foreground">
                    • {card.title}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirm} disabled={column.cards.length === 0}>
              {column.cards.length === 0
                ? "No Cards to Archive"
                : `Archive ${column.cards.length} Card${column.cards.length !== 1 ? "s" : ""}`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
