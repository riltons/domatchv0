import type React from "react"
import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

const CompetitionManagement: React.FC = () => {
  const [competitions, setCompetitions] = useState<any[]>([])
  const [communities, setCommunities] = useState<any[]>([])
  const [newCompetitionName, setNewCompetitionName] = useState("")
  const [selectedCommunity, setSelectedCommunity] = useState("")

  useEffect(() => {
    fetchCompetitions()
    fetchCommunities()
  }, [])

  const fetchCompetitions = async () => {
    const { data, error } = await supabase.from("competitions").select("*, communities(name)")

    if (error) {
      console.error("Error fetching competitions:", error)
    } else {
      setCompetitions(data || [])
    }
  }

  const fetchCommunities = async () => {
    const { data, error } = await supabase.from("communities").select("id, name")

    if (error) {
      console.error("Error fetching communities:", error)
    } else {
      setCommunities(data || [])
    }
  }

  const createCompetition = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase.from("competitions").insert([
      {
        name: newCompetitionName,
        community_id: selectedCommunity,
        status: "pending",
      },
    ])

    if (error) {
      console.error("Error creating competition:", error)
    } else {
      setNewCompetitionName("")
      setSelectedCommunity("")
      fetchCompetitions()
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold mb-4">Manage Competitions</h2>
      <form onSubmit={createCompetition} className="mb-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="competition-name" className="block text-sm font-medium text-gray-700">
              Competition Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="competition-name"
                id="competition-name"
                value={newCompetitionName}
                onChange={(e) => setNewCompetitionName(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="community" className="block text-sm font-medium text-gray-700">
              Community
            </label>
            <div className="mt-1">
              <select
                id="community"
                name="community"
                value={selectedCommunity}
                onChange={(e) => setSelectedCommunity(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              >
                <option value="">Select a community</option>
                {communities.map((community) => (
                  <option key={community.id} value={community.id}>
                    {community.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Competition
          </button>
        </div>
      </form>
      <ul className="divide-y divide-gray-200">
        {competitions.map((competition) => (
          <li key={competition.id} className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">{competition.name}</div>
                <div className="text-sm text-gray-500">{competition.communities.name}</div>
              </div>
              <div className="flex items-center">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    competition.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : competition.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {competition.status}
                </span>
                <button
                  onClick={() => {
                    /* TODO: Implement edit functionality */
                  }}
                  className="ml-2 px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Manage
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default CompetitionManagement

