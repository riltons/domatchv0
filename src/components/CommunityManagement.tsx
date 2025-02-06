import type React from "react"
import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

const CommunityManagement: React.FC = () => {
  const [communities, setCommunities] = useState<any[]>([])
  const [newCommunityName, setNewCommunityName] = useState("")

  useEffect(() => {
    fetchCommunities()
  }, [])

  const fetchCommunities = async () => {
    const { data, error } = await supabase.from("communities").select("*")

    if (error) {
      console.error("Error fetching communities:", error)
    } else {
      setCommunities(data || [])
    }
  }

  const createCommunity = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase.from("communities").insert([{ name: newCommunityName }])

    if (error) {
      console.error("Error creating community:", error)
    } else {
      setNewCommunityName("")
      fetchCommunities()
      // TODO: Implement WhatsApp group creation here
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold mb-4">Manage Communities</h2>
      <form onSubmit={createCommunity} className="mb-6">
        <div className="flex items-center">
          <input
            type="text"
            value={newCommunityName}
            onChange={(e) => setNewCommunityName(e.target.value)}
            placeholder="New Community Name"
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
            required
          />
          <button
            type="submit"
            className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Community
          </button>
        </div>
      </form>
      <ul className="divide-y divide-gray-200">
        {communities.map((community) => (
          <li key={community.id} className="py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-900">{community.name}</div>
              <button
                onClick={() => {
                  /* TODO: Implement edit functionality */
                }}
                className="ml-2 px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Edit
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CommunityManagement

