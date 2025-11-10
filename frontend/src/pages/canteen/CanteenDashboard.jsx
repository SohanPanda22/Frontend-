import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { LogOut, Menu, X } from 'lucide-react'

export default function CanteenDashboard() {
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
    { id: 'orders', label: 'Orders Management', icon: '📦' },
    { id: 'preferences', label: 'Tenant Preferences', icon: '📋' },
    { id: 'delivery', label: 'Delivery Coordination', icon: '🚚' },
    { id: 'menu', label: 'Menu Management', icon: '🍽️' },
    { id: 'feedback', label: 'Feedback', icon: '⭐' },
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
              <div className="grid md:grid-cols-4 gap-4">
                <div className="stats-card">
                  <p className="text-text-muted text-sm mb-2">Orders Today</p>
                  <h3 className="text-3xl font-bold text-primary">24</h3>
                </div>
                <div className="stats-card">
                  <p className="text-text-muted text-sm mb-2">Active Tenants</p>
                  <h3 className="text-3xl font-bold text-accent">158</h3>
                </div>
                <div className="stats-card">
                  <p className="text-text-muted text-sm mb-2">Rating</p>
                  <h3 className="text-3xl font-bold text-success">4.7/5</h3>
                </div>
                <div className="stats-card">
                  <p className="text-text-muted text-sm mb-2">Pending Deliveries</p>
                  <h3 className="text-3xl font-bold text-orange-500">6</h3>
                </div>
              </div>

              <div className="card">
                <h3 className="text-2xl font-bold mb-4 text-text-dark">Quick Actions</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <button className="btn-primary">View Today Orders</button>
                  <button className="btn-secondary">Update Menu</button>
                  <button className="btn-secondary">Send Notifications</button>
                </div>
              </div>

              <div className="card">
                <h3 className="text-2xl font-bold mb-4 text-text-dark">Weekly Sales</h3>
                <div className="chart">
                  <p className="p-4">Sales chart coming soon...</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Order ID</th>
                      <th className="px-4 py-2 text-left">Tenant</th>
                      <th className="px-4 py-2 text-left">Items</th>
                      <th className="px-4 py-2 text-left">Status</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="px-4 py-2">ORD001</td>
                      <td className="px-4 py-2">John Doe</td>
                      <td className="px-4 py-2">2x Biryani</td>
                      <td className="px-4 py-2"><span className="bg-yellow-100 px-2 py-1 rounded text-yellow-800">Pending</span></td>
                      <td className="px-4 py-2 space-x-2">
                        <button className="approve-btn">Accept</button>
                        <button className="reject-btn">Reject</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Tenant Preferences</h3>
              <p className="text-text-muted">Coming soon...</p>
            </div>
          )}

          {activeTab === 'delivery' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Delivery Coordination</h3>
              <p className="text-text-muted">Coming soon...</p>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Menu Management</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-6">
                <div className="menu-item">
                  <h4 className="font-semibold mb-2">Biryani</h4>
                  <p className="text-text-muted mb-2">₹150</p>
                  <button className="text-primary text-sm hover:underline">Edit</button>
                </div>
                <div className="menu-item">
                  <h4 className="font-semibold mb-2">Butter Chicken</h4>
                  <p className="text-text-muted mb-2">₹120</p>
                  <button className="text-primary text-sm hover:underline">Edit</button>
                </div>
                <div className="menu-item">
                  <h4 className="font-semibold mb-2">Dosa</h4>
                  <p className="text-text-muted mb-2">₹80</p>
                  <button className="text-primary text-sm hover:underline">Edit</button>
                </div>
              </div>
              <button className="btn-accent">Add New Item</button>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Feedback</h3>
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
