import type React from "react"
import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { supabase } from "../supabaseClient"
import { useOfflineData } from "../hooks/useOfflineData"
import { offlineMutationQueue } from "../utils/offlineMutationQueue"
import { calculateGameScore } from "../utils/calculateGameScore"

type MatchResult = {
  id: number
  game_id: number
  team1_score: number
  team2_score: number
  winner: "team1" | "team2" | "draw"
  victory_type: "simple" | "carroca" | "la-e-lo" | "cruzada" | "contagem" | null
}

const GameDetails: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>()
  const [game, setGame] = useState<any>(null)
  const [newMatchResult, setNewMatchResult] = useState<MatchResult>({
    id: 0,
    game_id: Number.parseInt(gameId || "0"),
    team1_score: 0,
    team2_score: 0,
    winner: "draw",
    victory_type: null,
  })

  const { data: matches, loading, error } = useOfflineData("matches", `*`, { game_id: gameId })

  useEffect(() => {
    fetchGameDetails()
  }, []) // Removed gameId from dependencies

  const fetchGameDetails = async () => {
    if (gameId) {
      const { data, error } = await supabase
        .from("games")
        .select(
          "*, competitions(name), team1_player1(name), team1_player2(name), team2_player1(name), team2_player2(name)",
        )
        .eq("id", gameId)
        .single()

      if (error) {
        console.error("Erro ao buscar detalhes do jogo:", error)
      } else {
        setGame(data)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setNewMatchResult((prev) => ({ ...prev, [name]: value }))
  }

  const calculateWinner = () => {
    if (newMatchResult.team1_score > newMatchResult.team2_score) {
      return "team1"
    } else if (newMatchResult.team2_score > newMatchResult.team1_score) {
      return "team2"
    } else {
      return "draw"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const winner = calculateWinner()
    const matchToSubmit = { ...newMatchResult, winner }

    if (navigator.onLine) {
      const { data, error } = await supabase.from("matches").insert([matchToSubmit])

      if (error) {
        console.error("Erro ao criar nova partida:", error)
      } else {
        // Atualizar a lista de partidas
        fetchGameDetails()
      }
    } else {
      offlineMutationQueue.addMutation({
        table: "matches",
        type: "INSERT",
        data: matchToSubmit,
      })
      // Atualizar a lista local de partidas
      setGame((prev) => ({
        ...prev,
        matches: [...(prev.matches || []), matchToSubmit],
      }))
    }

    // Resetar o formulário
    setNewMatchResult({
      id: 0,
      game_id: Number.parseInt(gameId || "0"),
      team1_score: 0,
      team2_score: 0,
      winner: "draw",
      victory_type: null,
    })
  }

  const gameScore = calculateGameScore(matches)

  if (loading) return <div>Carregando...</div>
  if (error) return <div>Erro ao carregar os dados: {error.message}</div>
  if (!game) return <div>Jogo não encontrado</div>

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">
        {game.competitions.name} - Jogo {game.id}
      </h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Detalhes do Jogo</h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Equipe 1</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {game.team1_player1.name} e {game.team1_player2.name}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Equipe 2</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {game.team2_player1.name} e {game.team2_player2.name}
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Status</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{game.status}</dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg leading-6 font-medium text-gray-900">Placar do Jogo</h2>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Equipe 1</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{gameScore.team1Score} pontos</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Equipe 2</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{gameScore.team2Score} pontos</dd>
            </div>
          </dl>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4">Partidas</h2>
      <ul className="divide-y divide-gray-200">
        {matches.map((match: MatchResult) => (
          <li key={match.id} className="py-4">
            <div className="flex justify-between">
              <span>Equipe 1: {match.team1_score}</span>
              <span>Equipe 2: {match.team2_score}</span>
              <span>
                Vencedor: {match.winner === "team1" ? "Equipe 1" : match.winner === "team2" ? "Equipe 2" : "Empate"}
              </span>
              <span>Tipo de Vitória: {match.victory_type || "N/A"}</span>
            </div>
          </li>
        ))}
      </ul>

      <h3 className="text-xl font-bold mt-8 mb-4">Adicionar Nova Partida</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="team1_score" className="block text-sm font-medium text-gray-700">
            Pontuação Equipe 1
          </label>
          <input
            type="number"
            id="team1_score"
            name="team1_score"
            value={newMatchResult.team1_score}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="team2_score" className="block text-sm font-medium text-gray-700">
            Pontuação Equipe 2
          </label>
          <input
            type="number"
            id="team2_score"
            name="team2_score"
            value={newMatchResult.team2_score}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
        </div>
        <div>
          <label htmlFor="victory_type" className="block text-sm font-medium text-gray-700">
            Tipo de Vitória
          </label>
          <select
            id="victory_type"
            name="victory_type"
            value={newMatchResult.victory_type || ""}
            onChange={handleInputChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Selecione o tipo de vitória</option>
            <option value="simple">Vitória Simples</option>
            <option value="carroca">Carroça</option>
            <option value="la-e-lo">Lá-e-lô</option>
            <option value="cruzada">Cruzada</option>
            <option value="contagem">Contagem de Pontos</option>
          </select>
        </div>
        <button
          type="submit"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Adicionar Partida
        </button>
      </form>
    </div>
  )
}

export default GameDetails

