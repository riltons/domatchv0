import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

const supabase = createClient(supabaseUrl, supabaseAnonKey)

interface MutationQueueItem {
  table: string
  type: "INSERT" | "UPDATE" | "DELETE"
  data: any
}

export class OfflineMutationQueue {
  private queue: MutationQueueItem[] = []

  constructor() {
    this.loadQueue()
  }

  private loadQueue() {
    const savedQueue = localStorage.getItem("offlineMutationQueue")
    if (savedQueue) {
      this.queue = JSON.parse(savedQueue)
    }
  }

  private saveQueue() {
    localStorage.setItem("offlineMutationQueue", JSON.stringify(this.queue))
  }

  addMutation(mutation: MutationQueueItem) {
    this.queue.push(mutation)
    this.saveQueue()
  }

  async processMutations() {
    while (this.queue.length > 0) {
      const mutation = this.queue.shift()
      if (mutation) {
        try {
          switch (mutation.type) {
            case "INSERT":
              await supabase.from(mutation.table).insert(mutation.data)
              break
            case "UPDATE":
              await supabase.from(mutation.table).update(mutation.data).eq("id", mutation.data.id)
              break
            case "DELETE":
              await supabase.from(mutation.table).delete().eq("id", mutation.data.id)
              break
          }
        } catch (error) {
          console.error("Error processing mutation:", error)
          this.queue.unshift(mutation)
          break
        }
      }
    }
    this.saveQueue()
  }
}

export const offlineMutationQueue = new OfflineMutationQueue()

