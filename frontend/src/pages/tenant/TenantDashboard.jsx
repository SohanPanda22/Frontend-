import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { LogOut, Menu, X } from 'lucide-react'
import { tenantAPI } from '../../services/api'

export default function TenantDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [userInHostel, setUserInHostel] = useState(user?.currentHostel ? true : false)
  const [hostels, setHostels] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedHostelId, setSelectedHostelId] = useState(null)
  const [selectedHostel, setSelectedHostel] = useState(null)

  useEffect(() => {
    // Fetch hostels for selection - only if not in hostel
    if (!userInHostel) {
      const fetchHostels = async () => {
        try {
          console.log('Fetching hostels...')
          setLoading(true)
          const response = await tenantAPI.searchHostels({ page: 1, limit: 100 })
          console.log('Hostels response:', response)
          setHostels(response.data?.data || [])
        } catch (error) {
          console.error('Error fetching hostels:', error)
          setHostels([])
        } finally {
          setLoading(false)
        }
      }

      fetchHostels()
    }
  }, [userInHostel])

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
        } bg-primary text-white transition-all duration-300 overflow-hidden fixed md:relative z-40 h-full flex flex-col`}
      >
        <div className="p-6 flex-1 overflow-y-auto">
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

        <div className="p-6 border-t border-blue-400">
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
            <>
              {!userInHostel ? (
                <div className="space-y-6">
                  {/* Welcome Message */}
                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-primary rounded-xl p-8">
                    <h2 className="text-3xl font-bold text-primary mb-3">Welcome to SafeStay Hub! 🎉</h2>
                    <p className="text-text-dark text-lg mb-2">
                      You haven't selected a hostel yet. Browse our available hostels and choose one to get started!
                    </p>
                    <p className="text-text-muted">
                      Once you select a hostel, you'll be able to view your room details, order food from the canteen, and manage your contracts.
                    </p>
                  </div>

                  {/* Hostel Selection */}
                  <div className="card">
                    <h3 className="text-2xl font-bold mb-6 text-text-dark">Choose Your Hostel</h3>
                    
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                          <p className="text-text-muted">Loading available hostels...</p>
                        </div>
                      </div>
                    ) : hostels.length > 0 ? (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {hostels.map((hostel) => (
                          <div
                            key={hostel._id}
                            className="border-2 border-gray-200 rounded-lg overflow-hidden hover:border-primary hover:shadow-xl transition-all cursor-pointer"
                            onClick={() => {
                              setSelectedHostelId(hostel._id)
                              setUserInHostel(true)
                              // Store selected hostel in localStorage for persistence
                              localStorage.setItem('selectedHostel', JSON.stringify({
                                id: hostel._id,
                                name: hostel.name,
                                address: hostel.address,
                                rent: hostel.priceRange?.min
                              }))
                              console.log('Selected hostel:', hostel.name)
                            }}
                          >
                            {/* Hostel Image */}
                            <div className="relative h-48 bg-gray-200 overflow-hidden">
                              {hostel.photos && hostel.photos.length > 0 ? (
                                <img
                                  src={hostel.photos[0].url}
                                  alt={hostel.name}
                                  className="w-full h-full object-cover hover:scale-105 transition-transform"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-indigo-100">
                                  <span className="text-4xl">🏢</span>
                                </div>
                              )}
                              {/* Verification Badge */}
                              {hostel.verificationStatus === 'verified' && (
                                <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                                  ✓ Verified
                                </div>
                              )}
                            </div>

                            {/* Hostel Details */}
                            <div className="p-5">
                              <h4 className="text-lg font-bold text-text-dark mb-1">{hostel.name}</h4>
                              <p className="text-text-muted text-sm mb-4 flex items-center gap-1">
                                📍 {hostel.address?.city}, {hostel.address?.state}
                              </p>

                              {/* Key Details Grid */}
                              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                  <span className="text-text-muted text-sm">Type:</span>
                                  <span className="font-semibold text-text-dark">
                                    {hostel.hostelType === 'co-ed' ? '👥 Co-ed' : hostel.hostelType === 'boys' ? '👨 Boys Only' : '👩 Girls Only'}
                                  </span>
                                </div>

                                <div className="flex justify-between items-center">
                                  <span className="text-text-muted text-sm">Rent Range:</span>
                                  <span className="font-semibold text-accent">₹{hostel.priceRange?.min} - ₹{hostel.priceRange?.max}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                  <span className="text-text-muted text-sm">Available Rooms:</span>
                                  <span className="font-semibold text-primary">{hostel.availableRooms || 0}/{hostel.totalRooms || 0}</span>
                                </div>

                                <div className="flex justify-between items-center">
                                  <span className="text-text-muted text-sm">Rating:</span>
                                  <span className="font-semibold text-yellow-500">
                                    ⭐ {hostel.rating ? hostel.rating.toFixed(1) : 'N/A'} ({hostel.reviewCount || 0} reviews)
                                  </span>
                                </div>
                              </div>

                              {/* Amenities Preview */}
                              {hostel.amenities && hostel.amenities.length > 0 && (
                                <div className="mb-4">
                                  <p className="text-xs font-semibold text-text-muted mb-2 uppercase">Amenities</p>
                                  <div className="flex flex-wrap gap-2">
                                    {hostel.amenities.slice(0, 3).map((amenity, idx) => (
                                      <span key={idx} className="bg-blue-50 text-primary text-xs px-2 py-1 rounded-full font-medium">
                                        {amenity}
                                      </span>
                                    ))}
                                    {hostel.amenities.length > 3 && (
                                      <span className="bg-gray-100 text-text-muted text-xs px-2 py-1 rounded-full font-medium">
                                        +{hostel.amenities.length - 3} more
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}

                              {/* Canteen Badge */}
                              {hostel.hasCanteen && (
                                <div className="mb-4 bg-orange-50 border border-orange-200 rounded-lg p-2 text-center">
                                  <p className="text-xs font-semibold text-orange-600">🍽️ Has Canteen</p>
                                </div>
                              )}

                              <button
                                onClick={async (e) => {
                                  // prevent parent card click which currently selects the hostel as "in-hostel"
                                  e.stopPropagation()
                                  setSelectedHostelId(hostel._id)
                                  setActiveTab('hostel')
                                  try {
                                    const resp = await tenantAPI.getHostelDetails(hostel._id)
                                    setSelectedHostel(resp.data?.data || null)
                                  } catch (err) {
                                    console.error('Error fetching hostel details:', err)
                                    setSelectedHostel(null)
                                  }
                                }}
                                className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center justify-center gap-2"
                              >
                                View Details →
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <p className="text-text-muted text-lg">No hostels available at the moment.</p>
                        <p className="text-text-muted mt-2">Please check back later or contact support.</p>
                      </div>
                    )}
                  </div>

                  {/* Quick Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="card">
                      <h4 className="text-lg font-bold text-text-dark mb-3">Why Choose SafeStay Hub?</h4>
                      <ul className="space-y-2 text-text-muted text-sm">
                        <li className="flex items-center gap-2">
                          <span className="text-primary">✓</span> Verified Hostels & Properties
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-primary">✓</span> Easy Room Booking
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-primary">✓</span> Integrated Canteen Services
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-primary">✓</span> Digital Contracts & Agreements
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-primary">✓</span> 24/7 Customer Support
                        </li>
                      </ul>
                    </div>

                    <div className="card">
                      <h4 className="text-lg font-bold text-text-dark mb-3">Need Help?</h4>
                      <p className="text-text-muted text-sm mb-4">
                        Our team is here to help you find the perfect hostel that fits your needs and budget.
                      </p>
                      <button className="btn-secondary w-full">Contact Support</button>
                    </div>
                  </div>
                </div>
              ) : (
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
            </>
          )}

          {activeTab === 'hostel' && (
            <div>
              {selectedHostel ? (
                <div className="card">
                  <div className="relative">
                    {selectedHostel.verificationStatus === 'verified' && (
                      <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                        ✓ Verified
                      </div>
                    )}
                    <div className="md:flex gap-6">
                      <div className="w-full md:w-1/3 h-56 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                        {selectedHostel.photos && selectedHostel.photos.length > 0 ? (
                          <img src={selectedHostel.photos[0].url} alt={selectedHostel.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="text-6xl">🏢</div>
                        )}
                      </div>

                      <div className="flex-1 p-4">
                        <h2 className="text-2xl font-bold text-text-dark">{selectedHostel.name}</h2>
                        <p className="text-text-muted mt-1">📍 {selectedHostel.address?.city}, {selectedHostel.address?.state}</p>

                        <div className="grid md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <p className="text-text-muted text-sm">Type</p>
                            <p className="font-semibold">{selectedHostel.hostelType === 'co-ed' ? '👥 Co-ed' : selectedHostel.hostelType === 'boys' ? '👨 Boys Only' : '👩 Girls Only'}</p>
                          </div>

                          <div>
                            <p className="text-text-muted text-sm">Rent Range</p>
                            <p className="font-semibold text-accent">₹{selectedHostel.priceRange?.min} - ₹{selectedHostel.priceRange?.max}</p>
                          </div>

                          <div>
                            <p className="text-text-muted text-sm">Available Rooms</p>
                            <p className="font-semibold text-primary">{selectedHostel.availableRooms || 0}/{selectedHostel.totalRooms || 0}</p>
                          </div>

                          <div>
                            <p className="text-text-muted text-sm">Rating</p>
                            <p className="font-semibold text-yellow-500">⭐ {selectedHostel.rating ? selectedHostel.rating.toFixed(1) : 'N/A'} ({selectedHostel.reviewCount || 0} reviews)</p>
                          </div>
                        </div>

                        {selectedHostel.amenities && selectedHostel.amenities.length > 0 && (
                          <div className="mt-4">
                            <p className="text-xs font-semibold text-text-muted mb-2 uppercase">Amenities</p>
                            <div className="flex flex-wrap gap-2">
                              {selectedHostel.amenities.map((a, i) => (
                                <span key={i} className="bg-blue-50 text-primary text-xs px-2 py-1 rounded-full font-medium">{a}</span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="mt-6 flex gap-3">
                          <button
                            onClick={() => {
                              // select this hostel as user's hostel
                              setUserInHostel(true)
                              setSelectedHostelId(selectedHostel._id)
                              localStorage.setItem('selectedHostel', JSON.stringify({
                                id: selectedHostel._id,
                                name: selectedHostel.name,
                                address: selectedHostel.address,
                                rent: selectedHostel.priceRange?.min
                              }))
                            }}
                            className="bg-primary text-white px-4 py-2 rounded-lg font-semibold"
                          >
                            Select Hostel
                          </button>

                          <button className="btn-secondary px-4 py-2 rounded-lg">Contact Owner</button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : user?.currentHostel ? (
                <div className="card">
                  <h3 className="text-2xl font-bold mb-4 text-text-dark">My Hostel</h3>
                  <p className="text-text-muted">{user.currentHostel.name || 'Your hostel details'}</p>
                </div>
              ) : (
                <div className="card">
                  <h3 className="text-2xl font-bold mb-4 text-text-dark">Hostel</h3>
                  <p className="text-text-muted">No hostel selected. Go to Overview and pick a hostel to view details.</p>
                </div>
              )}
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
