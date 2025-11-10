import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { LogOut, Menu, X } from 'lucide-react'

export default function OwnerDashboard() {
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
    { id: 'hostels', label: 'My Hostels', icon: '🏢' },
    { id: 'create', label: 'Create Hostel', icon: '➕' },
    { id: 'tenants', label: 'Tenant Management', icon: '👥' },
    { id: 'media', label: 'Upload 360° Media', icon: '📸' },
    { id: 'feedback', label: 'Feedback', icon: '⭐' },
    { id: 'profile', label: 'Profile', icon: '⚙️' },
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
                  <p className="text-text-muted text-sm mb-2">Active Hostels</p>
                  <h3 className="text-3xl font-bold text-primary">3</h3>
                </div>
                <div className="stats-card">
                  <p className="text-text-muted text-sm mb-2">Rooms Available</p>
                  <h3 className="text-3xl font-bold text-accent">12</h3>
                </div>
                <div className="stats-card">
                  <p className="text-text-muted text-sm mb-2">Pending Verifications</p>
                  <h3 className="text-3xl font-bold text-orange-500">2</h3>
                </div>
                <div className="stats-card">
                  <p className="text-text-muted text-sm mb-2">Tenant Requests</p>
                  <h3 className="text-3xl font-bold text-blue-600">5</h3>
                </div>
              </div>

              <div className="card">
                <h3 className="text-2xl font-bold mb-4 text-text-dark">Quick Actions</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <button className="btn-primary">Create New Hostel</button>
                  <button className="btn-secondary">View Tenant Requests</button>
                  <button className="btn-secondary">Upload Media</button>
                </div>
              </div>

              <div className="card">
                <h3 className="text-2xl font-bold mb-4 text-text-dark">Recent Activity</h3>
                <div className="chart">
                  <p className="p-4">Activity chart coming soon...</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hostels' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">My Hostels</h3>
              <p className="text-text-muted">Coming soon...</p>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="card max-w-4xl">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Create New Hostel</h3>
              <form className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <input type="text" placeholder="Hostel Name" className="input" />
                  <input type="text" placeholder="Location" className="input" />
                  <input type="number" placeholder="Number of Rooms" className="input" />
                  <input type="number" placeholder="Price per Month (₹)" className="input" />
                  <select className="input">
                    <option>Select Gender</option>
                    <option>Boys Only</option>
                    <option>Girls Only</option>
                    <option>Co-ed</option>
                  </select>
                  <input type="text" placeholder="Contact Number" className="input" />
                </div>
                <textarea placeholder="Description" className="input w-full h-32" />
                <button type="submit" className="submit-btn">Create Hostel</button>
              </form>
            </div>
          )}

          {activeTab === 'tenants' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Tenant Management</h3>
              <p className="text-text-muted">Coming soon...</p>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Upload 360° Media</h3>
              <div className="upload-btn">
                <p className="text-text-muted text-center">Drag and drop files here or click to upload</p>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Feedback</h3>
              <p className="text-text-muted">Coming soon...</p>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Profile Settings</h3>
              <p className="text-text-muted">Coming soon...</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
