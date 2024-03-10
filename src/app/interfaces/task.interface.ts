export interface TaskInterface {
  id?: number
  description: string
  done: boolean
  priority?: "high" | "medium" | "low"
  created: Date
}
