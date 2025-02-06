import type React from "react"
import { useState, useEffect } from "react"
import { supabase } from "../supabaseClient"

const GameManagement: React.FC = () => {
  const [games, setGames] = useState<any[]>([])
  const [competitions, setCompetitions] = useState<any[]>([])
  const [selectedCompetition, setSelectedCompetition] = useState("")
  const [team1Player1, setTeam1Player1] = useState("")
  const [team1Player2, setTeam1Player2] = useState("")
  const [team2Player1, setTeam2Player1] = useState("")
  const [team2Player2, setTeam2Player2] = useState("")

  useEffect(() => {
    fetchGames()
    fetchCompetitions()
  }, [])

  const fetchGames = async () => {
    const { data, error } = await supabase.from("games").select("*, competitions(name)")

    if (error) {
      console.error("Error fetching games:", error)
    } else {
      setGames(data || [])
    }
  }

  const fetchCompetitions = async () => {
    const { data, error } = await supabase.from("competitions").select("id, name").eq("status", "active")

    if (error) {
      console.error("Error fetching competitions:", error)
    } else {
      setCompetitions(data || [])
    }
  }

  const createGame = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase.from("games").insert([
      {
        competition_id: selectedCompetition,
        team1_player1: team1Player1,
        team1_player2: team1Player2,
        team2_player1: team2Player1,
        team2_player2: team2Player2,
        status: "pending",
      },
    ])

    if (error) {
      console.error("Error creating game:", error)
    } else {
      setSelectedCompetition("")
      setTeam1Player1("")
      setTeam1Player2("")
      setTeam2Player1("")
      setTeam2Player2("")
      fetchGames()
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-semibold mb-4">Manage Games</h2>
      <form onSubmit={createGame} className="mb-6">
        <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="competition" className="block text-sm font-medium text-gray-700">
              Competition
            </label>
            <div className="mt-1">
              <select
                id="competition"
                name="competition"
                value={selectedCompetition}
                onChange={(e) => setSelectedCompetition(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              >
                <option value="">Select a competition</option>
                {competitions.map((competition) => (
                  <option key={competition.id} value={competition.id}>
                    {competition.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
          <div className="sm:col-span-3">
            <label htmlFor="team1-player1" className="block text-sm font-medium text-gray-700">
              Team 1 - Player 1
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="team1-player1"
                id="team1-player1"
                value={team1Player1}
                onChange={(e) => setTeam1Player1(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="team1-player2" className="block text-sm font-medium text-gray-700">
              Team 1 - Player 2
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="team1-player2"
                id="team1-player2"
                value={team1Player2}
                onChange={(e) => setTeam1Player2(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="team2-player1" className="block text-sm font-medium text-gray-700">
              Team 2 - Player 1
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="team2-player1"
                id="team2-player1"
                value={team2Player1}
                onChange={(e) => setTeam2Player1(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="sm:col-span-3">
            <label htmlFor="team2-player2" className="block text-sm font-medium text-gray-700">
              Team 2 - Player 2
            </label>
            <div className="mt-1">
              <input
                type="text"
                name="team2-player2"
                id="team2-player2"
                value={team2Player2}
                onChange={(e) => setTeam2Player2(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Game
          </button>
        </div>
      </form>
      <ul className="divide-y divide-gray-200">
        {games.map((game) => (
          <li key={game.id} className="py-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {game.competitions.name} - Game {game.id}
                </div>
                <div className="text-sm text-gray-500">
                  {game.team1_player1} & {game.team1_player2} vs {game.team2_player1} & {game.team2_player2}
                </div>
              </div>
              <div className="flex items-center">
                <span
                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    game.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : game.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                  }`}
                >
                  {game.status}
                </span>
                <button
                  onClick={() => {
                    /* TODO: Implement game management functionality */
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

export default GameManagement

