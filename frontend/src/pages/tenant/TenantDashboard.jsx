import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { LogOut, Menu, X } from 'lucide-react'

export default function TenantDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: '📊' },
    { id: 'hostel', label: 'My Hostel', icon: '🏢' },
    { id: 'canteen', label: 'Canteen & Food', icon: '🍽️' },
    { id: 'contracts', label: 'My Contracts', icon: '📄' },
    { id: 'expenses', label: 'My Expenses', icon: '💰' },
    { id: 'feedback', label: 'Feedback', icon: '⭐' },
    { id: 'payments', label: 'Payments', icon: '💳' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-primary text-white transition-all duration-300 overflow-hidden fixed md:relative z-40 h-full`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-8">SafeStay Hub</h1>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id ? 'bg-white text-primary font-semibold' : 'hover:bg-blue-600'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="absolute bottom-6 left-6 right-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Top Bar */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-primary"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
          <h2 className="text-2xl font-bold text-text-dark">
            {menuItems.find((item) => item.id === activeTab)?.label}
          </h2>
          <div className="text-text-muted">Welcome, {user?.name}</div>
        </div>

        {/* Content Area */}
        <div className="p-8">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="stats-card">
                  <p className="text-text-muted text-sm mb-2">Current Hostel</p>
                  <h3 className="text-2xl font-bold text-primary mb-2">Green Valley Hostel</h3>
                  <p className="text-text-muted">Rent: ₹8,000/month</p>
                </div>

                <div className="stats-card">
                  <p className="text-text-muted text-sm mb-2">Canteen Expenses</p>
                  <h3 className="text-2xl font-bold text-accent">₹2,450</h3>
                  <p className="text-text-muted">This month</p>
                </div>

                <div className="stats-card">
                  <p className="text-text-muted text-sm mb-2">Your Rating</p>
                  <h3 className="text-2xl font-bold text-success">4.8/5</h3>
                  <p className="text-text-muted">Based on 24 reviews</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="card">
                  <h3 className="text-xl font-bold mb-4 text-text-dark">Quick Actions</h3>
                  <div className="space-y-3">
                    <button className="btn-primary w-full text-left py-3">Order Food</button>
                    <button className="btn-secondary w-full text-left py-3">View Contracts</button>
                    <button className="btn-secondary w-full text-left py-3">Submit Feedback</button>
                  </div>
                </div>

                <div className="card">
                  <h3 className="text-xl font-bold mb-4 text-text-dark">Recent Notifications</h3>
                  <div className="space-y-3 text-sm">
                    <p className="border-l-4 border-primary pl-3">✓ Payment received for this month</p>
                    <p className="border-l-4 border-accent pl-3">📦 Food order delivered</p>
                    <p className="border-l-4 border-success pl-3">⭐ Your feedback was helpful</p>
                  </div>
                </div>
              </div>

              <button className="sos-button text-lg font-bold">🚨 SOS - EMERGENCY BUTTON</button>
            </div>
          )}

          {activeTab === 'hostel' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">My Hostel</h3>
              <p className="text-text-muted">Coming soon...</p>
            </div>
          )}

          {activeTab === 'canteen' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Canteen & Food</h3>
              <p className="text-text-muted">Coming soon...</p>
            </div>
          )}

          {activeTab === 'contracts' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">My Contracts</h3>
              <p className="text-text-muted">Coming soon...</p>
            </div>
          )}

          {activeTab === 'expenses' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">My Expenses</h3>
              <p className="text-text-muted">Coming soon...</p>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Feedback & Suggestions</h3>
              <p className="text-text-muted">Coming soon...</p>
            </div>
          )}

          {activeTab === 'payments' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Payments</h3>
              <p className="text-text-muted">Coming soon...</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Settings</h3>
              <p className="text-text-muted">Coming soon...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
