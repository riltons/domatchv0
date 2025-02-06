"use client"

import { useEffect, useState } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { offlineMutationQueue } from "./utils/offlineMutationQueue"
import { isSupabaseConfigured } from "./supabaseClient"
import Login from "./components/Login"
import Register from "./components/Register"
import Dashboard from "./components/Dashboard"
import CommunityManagement from "./components/CommunityManagement"
import CompetitionManagement from "./components/CompetitionManagement"
import GameManagement from "./components/GameManagement"
import GameDetails from "./components/GameDetails"

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const handleOnline = () => {
      offlineMutationQueue.processMutations()
    }

    window.addEventListener("online", handleOnline)

    // Simula um carregamento para garantir que tudo esteja inicializado
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => {
      window.removeEventListener("online", handleOnline)
    }
  }, [])

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Carregando...</div>
  }

  if (!isSupabaseConfigured) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-red-100 text-red-800 p-4">
        Erro: As variáveis de ambiente do Supabase não estão configuradas corretamente.
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/communities" element={<CommunityManagement />} />
          <Route path="/competitions" element={<CompetitionManagement />} />
          <Route path="/games" element={<GameManagement />} />
          <Route path="/games/:gameId" element={<GameDetails />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App

