import type React from "react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { supabase } from "../supabaseClient"

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (error) {
          console.error("Error fetching user profile:", error)
        } else {
          setUser(data)
        }
      }
    }

    fetchUser()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">Domino Competition App</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold mb-4">Welcome, {user.name}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link to="/communities" className="bg-white overflow-hidden shadow rounded-lg p-6 hover:bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Manage Communities</h3>
            <p className="mt-2 text-sm text-gray-500">Create and manage your domino communities</p>
          </Link>
          <Link to="/competitions" className="bg-white overflow-hidden shadow rounded-lg p-6 hover:bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Manage Competitions</h3>
            <p className="mt-2 text-sm text-gray-500">Create and manage domino competitions</p>
          </Link>
          <Link to="/games" className="bg-white overflow-hidden shadow rounded-lg p-6 hover:bg-gray-50">
            <h3 className="text-lg font-medium text-gray-900">Manage Games</h3>
            <p className="mt-2 text-sm text-gray-500">Record and manage domino games</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard

