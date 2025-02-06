import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

export function useOfflineData(table: string, query: any) {
  const [data, setData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        // Try to fetch data from local storage first
        const localData = localStorage.getItem(`offline_${table}`)
        if (localData) {
          setData(JSON.parse(localData))
          setLoading(false)
        }

        // Fetch data from Supabase
        const { data: supabaseData, error } = await supabase.from(table).select(query)

        if (error) {
          throw error
        }

        // Update state and local storage with fresh data
        setData(supabaseData)
        localStorage.setItem(`offline_${table}`, JSON.stringify(supabaseData))
      } catch (err) {
        setError(err as Error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [table, query])

  return { data, loading, error }
}

