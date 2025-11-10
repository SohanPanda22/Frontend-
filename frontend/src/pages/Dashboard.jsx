import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { LogOut } from 'lucide-react'

export default function Dashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const getDashboardLink = () => {
    if (!user) return '/'
    switch (user.userRole) {
      case 'tenant':
        return '/tenant'
      case 'owner':
        return '/owner'
      case 'provider':
        return '/canteen'
      case 'admin':
        return '/admin'
      default:
        return '/'
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <nav className="bg-primary text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">SafeStay Hub</h1>
          <div className="flex items-center gap-4">
            <span>Welcome, {user?.name || 'User'}</span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="card">
          <h2 className="text-3xl font-bold mb-4 text-text-dark">Welcome to SafeStay Hub</h2>
          <p className="text-text-muted mb-6">
            You are logged in as <span className="font-semibold">{user?.userRole}</span>
          </p>

          <button
            onClick={() => navigate(getDashboardLink())}
            className="btn-primary"
          >
            Go to {user?.userRole} Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}
