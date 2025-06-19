"use client"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { Plus, MoreVertical, Trash2, Archive, GripVertical } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card as UICard } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { KanbanCard } from "@/components/kanban-card"
import type { Board, Card } from "@/types/kanban"

interface KanbanBoardProps {
  board: Board
  onAddCard: (columnId: string) => void
  onEditCard: (card: Card) => void
  onDeleteCard: (cardId: string) => void
  onDeleteColumn: (columnId: string) => void
  onMoveCard: (cardId: string, fromColumnId: string, toColumnId: string, newIndex: number) => void
  onMoveColumn: (columnId: string, newIndex: number) => void
  onExtendDueDate: (card: Card) => void
  onAcknowledgeOverdue: (cardId: string) => void
  onArchiveAllCards: (columnId: string) => void
}

export function KanbanBoard({
  board,
  onAddCard,
  onEditCard,
  onDeleteCard,
  onDeleteColumn,
  onMoveCard,
  onMoveColumn,
  onExtendDueDate,
  onAcknowledgeOverdue,
  onArchiveAllCards,
}: KanbanBoardProps) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return

    const { source, destination, draggableId, type } = result

    // If dropped in the same position, do nothing
    if (source.droppableId === destination.droppableId && source.index === destination.index) {
      return
    }

    // Handle column reordering
    if (type === "COLUMN") {
      onMoveColumn(draggableId, destination.index)
      return
    }

    // Handle card movement (existing logic)
    onMoveCard(draggableId, source.droppableId, destination.droppableId, destination.index)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="board" type="COLUMN" direction="horizontal">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex gap-6 overflow-x-auto pb-6 scrollbar-thin ${
              snapshot.isDraggingOver ? "bg-accent/20 rounded-lg p-2" : ""
            }`}
          >
            {board.columns.map((column, index) => (
              <Draggable key={column.id} draggableId={column.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`flex-shrink-0 w-80 ${snapshot.isDragging ? "rotate-1 scale-105 shadow-2xl z-50" : ""}`}
                  >
                    <UICard
                      className={`h-fit border-2 ${snapshot.isDragging ? "border-primary shadow-lg" : "dark:border-border"}`}
                    >
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div
                              {...provided.dragHandleProps}
                              className="cursor-grab active:cursor-grabbing p-1 hover:bg-accent rounded"
                              title="Drag to reorder column"
                            >
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            </div>
                            <h3 className="font-semibold text-foreground">{column.name}</h3>
                            <span className="text-sm text-muted-foreground bg-muted px-2 py-1 rounded-full">
                              {column.cards.length}
                            </span>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-accent">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => onArchiveAllCards(column.id)}
                                disabled={column.cards.length === 0}
                              >
                                <Archive className="h-4 w-4 mr-2" />
                                Archive All Cards ({column.cards.length})
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => onDeleteColumn(column.id)} className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Column
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <Droppable droppableId={column.id} type="CARD">
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className={`space-y-3 min-h-[200px] p-2 rounded-lg ${
                                snapshot.isDraggingOver ? "bg-accent/50" : ""
                              }`}
                            >
                              {column.cards.map((card, cardIndex) => (
                                <Draggable key={card.id} draggableId={card.id} index={cardIndex}>
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={snapshot.isDragging ? "rotate-2 scale-105 z-50" : ""}
                                      style={{
                                        ...provided.draggableProps.style,
                                        // Ensure smooth transitions by removing conflicting transforms
                                        transform: snapshot.isDragging
                                          ? provided.draggableProps.style?.transform
                                          : "none",
                                      }}
                                    >
                                      <KanbanCard
                                        card={card}
                                        availableTags={board.tags}
                                        onEdit={() => onEditCard(card)}
                                        onDelete={() => onDeleteCard(card.id)}
                                        onExtendDueDate={() => onExtendDueDate(card)}
                                        onAcknowledgeOverdue={() => onAcknowledgeOverdue(card.id)}
                                      />
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>

                        <Button
                          variant="ghost"
                          className="w-full mt-3 border-2 border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-accent/50"
                          onClick={() => onAddCard(column.id)}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Card
                        </Button>
                      </div>
                    </UICard>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
