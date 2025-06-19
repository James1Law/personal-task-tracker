export interface Card {
  id: string
  title: string
  description?: string
  priority: "low" | "medium" | "high"
  dueDate?: string
  overdueAcknowledged?: boolean
  tags?: string[]
  createdAt: string
}

export interface Column {
  id: string
  name: string
  cards: Card[]
}

export interface Tag {
  id: string
  name: string
  color: string
}

export interface Board {
  id: string
  name: string
  columns: Column[]
  tags: Tag[]
}
