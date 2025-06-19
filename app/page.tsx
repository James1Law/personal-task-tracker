"use client"

import type React from "react"

import { useState } from "react"
import { Plus, Search, Filter, Download, Upload, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTheme } from "next-themes"
import { KanbanBoard } from "@/components/kanban-board"
import { AddColumnDialog } from "@/components/add-column-dialog"
import { AddCardDialog } from "@/components/add-card-dialog"
import { EditCardDialog } from "@/components/edit-card-dialog"
import { TagManager } from "@/components/tag-manager"
import { useLocalStorage } from "@/hooks/use-local-storage"
import type { Board, Card, Column, Tag } from "@/types/kanban"
import { ExtendDueDateDialog } from "@/components/extend-due-date-dialog"
import { ArchiveColumnDialog } from "@/components/archive-column-dialog"

const defaultBoard: Board = {
  id: "main-board",
  name: "My Tasks",
  columns: [
    { id: "todo", name: "To Do", cards: [] },
    { id: "in-progress", name: "In Progress", cards: [] },
    { id: "done", name: "Done", cards: [] },
  ],
  tags: [
    { id: "urgent", name: "Urgent", color: "#ef4444" },
    { id: "work", name: "Work", color: "#3b82f6" },
    { id: "personal", name: "Personal", color: "#10b981" },
  ],
}

export default function KanbanApp() {
  const [board, setBoard] = useLocalStorage<Board>("kanban-board", defaultBoard)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [showAddColumn, setShowAddColumn] = useState(false)
  const [showAddCard, setShowAddCard] = useState(false)
  const [showEditCard, setShowEditCard] = useState(false)
  const [showTagManager, setShowTagManager] = useState(false)
  const [selectedColumnId, setSelectedColumnId] = useState<string>("")
  const [selectedCard, setSelectedCard] = useState<Card | null>(null)
  const { theme, setTheme } = useTheme()

  const [showExtendDueDate, setShowExtendDueDate] = useState(false)
  const [extendingCard, setExtendingCard] = useState<Card | null>(null)

  const [showArchiveColumn, setShowArchiveColumn] = useState(false)
  const [archivingColumn, setArchivingColumn] = useState<Column | null>(null)

  const addColumn = (name: string) => {
    const newColumn: Column = {
      id: `column-${Date.now()}`,
      name,
      cards: [],
    }
    setBoard((prev) => ({
      ...prev,
      columns: [...prev.columns, newColumn],
    }))
  }

  const deleteColumn = (columnId: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.filter((col) => col.id !== columnId),
    }))
  }

  const addCard = (columnId: string, cardData: Omit<Card, "id" | "createdAt">) => {
    const newCard: Card = {
      ...cardData,
      id: `card-${Date.now()}`,
      createdAt: new Date().toISOString(),
    }

    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => (col.id === columnId ? { ...col, cards: [...col.cards, newCard] } : col)),
    }))
  }

  const updateCard = (cardData: Card) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => ({
        ...col,
        cards: col.cards.map((card) => (card.id === cardData.id ? cardData : card)),
      })),
    }))
  }

  const deleteCard = (cardId: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => ({
        ...col,
        cards: col.cards.filter((card) => card.id !== cardId),
      })),
    }))
  }

  const moveCard = (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number) => {
    setBoard((prev) => {
      const fromColumn = prev.columns.find((col) => col.id === fromColumnId)
      const toColumn = prev.columns.find((col) => col.id === toColumnId)

      if (!fromColumn || !toColumn) return prev

      const cardToMove = fromColumn.cards.find((card) => card.id === cardId)
      if (!cardToMove) return prev

      // Moving within the same column (reorder)
      if (fromColumnId === toColumnId) {
        const newCards = [...fromColumn.cards]
        const oldIndex = newCards.findIndex((card) => card.id === cardId)
        if (oldIndex === -1) return prev

        newCards.splice(oldIndex, 1) // Remove from old position
        newCards.splice(newIndex, 0, cardToMove) // Insert at new position

        const newColumns = prev.columns.map((col) =>
          col.id === fromColumnId ? { ...col, cards: newCards } : col
        )
        return { ...prev, columns: newColumns }
      }

      // Moving to a different column
      const newColumns = prev.columns.map((col) => {
        if (col.id === fromColumnId) {
          return {
            ...col,
            cards: col.cards.filter((card) => card.id !== cardId),
          }
        }
        if (col.id === toColumnId) {
          const newCards = [...col.cards]
          newCards.splice(newIndex, 0, cardToMove)
          return {
            ...col,
            cards: newCards,
          }
        }
        return col
      })

      return {
        ...prev,
        columns: newColumns,
      }
    })
  }

  const moveColumn = (columnId: string, newIndex: number) => {
    setBoard((prev) => {
      const columnToMove = prev.columns.find((col) => col.id === columnId)
      if (!columnToMove) return prev

      const newColumns = [...prev.columns]
      const currentIndex = newColumns.findIndex((col) => col.id === columnId)

      // Remove the column from its current position
      newColumns.splice(currentIndex, 1)

      // Insert it at the new position
      newColumns.splice(newIndex, 0, columnToMove)

      return {
        ...prev,
        columns: newColumns,
      }
    })
  }

  const addTag = (tag: Omit<Tag, "id">) => {
    const newTag: Tag = {
      ...tag,
      id: `tag-${Date.now()}`,
    }
    setBoard((prev) => ({
      ...prev,
      tags: [...prev.tags, newTag],
    }))
  }

  const updateTag = (tagData: Tag) => {
    setBoard((prev) => ({
      ...prev,
      tags: prev.tags.map((tag) => (tag.id === tagData.id ? tagData : tag)),
    }))
  }

  const deleteTag = (tagId: string) => {
    setBoard((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag.id !== tagId),
      columns: prev.columns.map((col) => ({
        ...col,
        cards: col.cards.map((card) => ({
          ...card,
          tags: card.tags?.filter((t) => t !== tagId) || [],
        })),
      })),
    }))
  }

  const exportBoard = () => {
    const dataStr = JSON.stringify(board, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `kanban-board-${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const importBoard = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedBoard = JSON.parse(e.target?.result as string)
        setBoard(importedBoard)
      } catch (error) {
        console.error("Failed to import board:", error)
      }
    }
    reader.readAsText(file)
  }

  const filteredBoard = {
    ...board,
    columns: board.columns.map((column) => ({
      ...column,
      cards: column.cards.filter((card) => {
        const matchesSearch =
          card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          card.description?.toLowerCase().includes(searchTerm.toLowerCase())

        const matchesTags = selectedTags.length === 0 || selectedTags.some((tagId) => card.tags?.includes(tagId))

        const matchesPriority = selectedPriority === "all" || card.priority === selectedPriority

        return matchesSearch && matchesTags && matchesPriority
      }),
    })),
  }

  const handleAddCard = (columnId: string) => {
    setSelectedColumnId(columnId)
    setShowAddCard(true)
  }

  const handleEditCard = (card: Card) => {
    setSelectedCard(card)
    setShowEditCard(true)
  }

  const handleExtendDueDate = (card: Card) => {
    setExtendingCard(card)
    setShowExtendDueDate(true)
  }

  const handleAcknowledgeOverdue = (cardId: string) => {
    setBoard((prev) => ({
      ...prev,
      columns: prev.columns.map((col) => ({
        ...col,
        cards: col.cards.map((card) => (card.id === cardId ? { ...card, overdueAcknowledged: true } : card)),
      })),
    }))
  }

  const handleArchiveAllCards = (columnId: string) => {
    const column = board.columns.find((col) => col.id === columnId)
    if (column) {
      setArchivingColumn(column)
      setShowArchiveColumn(true)
    }
  }

  const confirmArchiveAllCards = () => {
    if (archivingColumn) {
      setBoard((prev) => ({
        ...prev,
        columns: prev.columns.map((col) => (col.id === archivingColumn.id ? { ...col, cards: [] } : col)),
      }))
    }
  }

  return (
    <div className="min-h-screen bg-background transition-colors">
      <header className="border-b bg-card shadow-sm dark:shadow-none">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-foreground">{board.name}</h1>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hover:bg-accent"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search cards..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 w-full md:w-64 bg-background"
                />
              </div>

              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-32 bg-background">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>

              <Button variant="outline" size="sm" onClick={() => setShowTagManager(true)} className="hover:bg-accent">
                <Filter className="h-4 w-4 mr-2" />
                Tags
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddColumn(true)}
                className={`hover:bg-accent ${board.columns.length === 0 ? 'ring-2 ring-primary ring-offset-2 animate-pulse' : ''}`}
                id="add-column-btn"
              >
                <Plus className="h-4 w-4 mr-2" />
                Column
              </Button>

              <Button variant="outline" size="sm" onClick={exportBoard} className="hover:bg-accent">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>

              <label className="cursor-pointer">
                <Button variant="outline" size="sm" asChild className="hover:bg-accent">
                  <span>
                    <Upload className="h-4 w-4 mr-2" />
                    Import
                  </span>
                </Button>
                <input type="file" accept=".json" onChange={importBoard} className="hidden" />
              </label>
            </div>
          </div>

          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-sm text-muted-foreground">Filtered by:</span>
              {selectedTags.map((tagId) => {
                const tag = board.tags.find((t) => t.id === tagId)
                return tag ? (
                  <Badge
                    key={tagId}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80"
                    onClick={() => setSelectedTags((prev) => prev.filter((id) => id !== tagId))}
                  >
                    {tag.name} ×
                  </Badge>
                ) : null
              })}
            </div>
          )}

          {/* Show message if no columns exist */}
          {board.columns.length === 0 && (
            <div className="flex flex-col items-center justify-center mt-10">
              <span className="text-lg font-medium text-muted-foreground mb-2">Click <span className="font-bold text-primary">+ Column</span> to get started.</span>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto p-4">
        <KanbanBoard
          board={filteredBoard}
          onAddCard={handleAddCard}
          onEditCard={handleEditCard}
          onDeleteCard={deleteCard}
          onDeleteColumn={deleteColumn}
          onMoveCard={moveCard}
          onMoveColumn={moveColumn}
          onExtendDueDate={handleExtendDueDate}
          onAcknowledgeOverdue={handleAcknowledgeOverdue}
          onArchiveAllCards={handleArchiveAllCards}
        />
      </main>

      <ExtendDueDateDialog
        open={showExtendDueDate}
        onOpenChange={setShowExtendDueDate}
        card={extendingCard}
        onUpdateCard={updateCard}
      />

      <AddColumnDialog open={showAddColumn} onOpenChange={setShowAddColumn} onAddColumn={addColumn} />

      <AddCardDialog
        open={showAddCard}
        onOpenChange={setShowAddCard}
        onAddCard={(cardData) => addCard(selectedColumnId, cardData)}
        availableTags={board.tags}
      />

      <EditCardDialog
        open={showEditCard}
        onOpenChange={setShowEditCard}
        card={selectedCard}
        onUpdateCard={updateCard}
        availableTags={board.tags}
      />

      <TagManager
        open={showTagManager}
        onOpenChange={setShowTagManager}
        tags={board.tags}
        selectedTags={selectedTags}
        onSelectedTagsChange={setSelectedTags}
        onAddTag={addTag}
        onUpdateTag={updateTag}
        onDeleteTag={deleteTag}
      />

      <ArchiveColumnDialog
        open={showArchiveColumn}
        onOpenChange={setShowArchiveColumn}
        column={archivingColumn}
        onConfirm={confirmArchiveAllCards}
      />
    </div>
  )
}
