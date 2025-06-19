"use client"

import type React from "react"

import { format, isBefore, addDays } from "date-fns"
import { Calendar, Clock, MoreVertical, Trash2, Edit, AlertTriangle, CalendarPlus, CheckCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Card as CardType, Tag } from "@/types/kanban"

interface KanbanCardProps {
  card: CardType
  availableTags: Tag[]
  onEdit: () => void
  onDelete: () => void
  onExtendDueDate: () => void
  onAcknowledgeOverdue: () => void
}

export function KanbanCard({
  card,
  availableTags,
  onEdit,
  onDelete,
  onExtendDueDate,
  onAcknowledgeOverdue,
}: KanbanCardProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getDueDateStatus = (dueDate?: string, acknowledged?: boolean) => {
    if (!dueDate) return null

    const due = new Date(dueDate)
    const now = new Date()
    const tomorrow = addDays(now, 1)

    if (isBefore(due, now)) {
      return {
        status: "overdue",
        color: acknowledged ? "secondary" : "destructive",
        acknowledged,
      }
    } else if (isBefore(due, tomorrow)) {
      return { status: "due-soon", color: "default" }
    }
    return null
  }

  const dueDateStatus = getDueDateStatus(card.dueDate, card.overdueAcknowledged)

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    onEdit()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    onDelete()
  }

  return (
    <Card
      className={`group p-4 cursor-pointer hover:shadow-md ${
        dueDateStatus?.status === "overdue" && !dueDateStatus.acknowledged
          ? "border-destructive bg-destructive/5 dark:bg-destructive/10"
          : dueDateStatus?.status === "overdue" && dueDateStatus.acknowledged
            ? "border-muted bg-muted/50 dark:bg-muted/20"
            : dueDateStatus?.status === "due-soon"
              ? "border-yellow-500 bg-yellow-50 dark:bg-yellow-950/20"
              : "hover:bg-accent/50"
      }`}
      onClick={onEdit}
      onDoubleClick={onEdit}
      title="Click to edit card"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h4 className="font-medium leading-tight pr-2">{card.title}</h4>
          <div className="flex items-center gap-1 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 opacity-60 group-hover:opacity-100 hover:opacity-100 hover:bg-accent"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Card
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Card
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {dueDateStatus?.status === "overdue" && !dueDateStatus.acknowledged && (
          <div className="flex gap-2 mb-3">
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs hover:bg-accent"
              onClick={(e) => {
                e.stopPropagation()
                onExtendDueDate()
              }}
            >
              <CalendarPlus className="h-3 w-3 mr-1" />
              Extend
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs hover:bg-accent"
              onClick={(e) => {
                e.stopPropagation()
                onAcknowledgeOverdue()
              }}
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              Acknowledge
            </Button>
          </div>
        )}

        {card.description && <p className="text-sm text-muted-foreground line-clamp-3">{card.description}</p>}

        <div className="flex flex-wrap gap-2">
          <Badge variant={getPriorityColor(card.priority)} className="text-xs">
            {card.priority}
          </Badge>

          {card.tags?.map((tagId) => {
            const tag = availableTags.find((t) => t.id === tagId)
            return tag ? (
              <Badge
                key={tagId}
                variant="outline"
                className="text-xs border-2"
                style={{
                  borderColor: tag.color,
                  color: tag.color,
                  backgroundColor: `${tag.color}10`,
                }}
              >
                {tag.name}
              </Badge>
            ) : null
          })}
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span>{format(new Date(card.createdAt), "MMM d")}</span>
          </div>

          {card.dueDate && (
            <div
              className={`flex items-center gap-1 ${
                dueDateStatus?.status === "overdue" && !dueDateStatus.acknowledged
                  ? "text-destructive"
                  : dueDateStatus?.status === "overdue" && dueDateStatus.acknowledged
                    ? "text-muted-foreground"
                    : dueDateStatus?.status === "due-soon"
                      ? "text-yellow-600 dark:text-yellow-400"
                      : ""
              }`}
            >
              {dueDateStatus?.status === "overdue" && !dueDateStatus.acknowledged && (
                <AlertTriangle className="h-3 w-3" />
              )}
              {dueDateStatus?.status === "overdue" && dueDateStatus.acknowledged && <CheckCircle className="h-3 w-3" />}
              {dueDateStatus?.status === "due-soon" && <AlertTriangle className="h-3 w-3" />}
              <Clock className="h-3 w-3" />
              <span>
                {format(new Date(card.dueDate), "MMM d")}
                {dueDateStatus?.status === "overdue" && dueDateStatus.acknowledged && " (ack)"}
              </span>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
