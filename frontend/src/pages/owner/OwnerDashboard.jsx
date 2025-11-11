import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'
import { LogOut, Menu, X } from 'lucide-react'
import { ownerAPI } from '../../services/api'

export default function OwnerDashboard() {
  const navigate = useNavigate()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [createMessage, setCreateMessage] = useState('')
  const [createForm, setCreateForm] = useState({
    name: '',
    address: { street: '', city: '', state: '', pincode: '' },
    description: '',
    hostelType: 'boys',
    priceRange: { min: '', max: '' },
  })
  const [mediaFiles, setMediaFiles] = useState([]) // {file, url, type}
  const [profile, setProfile] = useState({ displayName: '', contact: '' })
  const [feedbacks, setFeedbacks] = useState([
    { id: 1, author: 'John Doe', text: 'Great experience, clean rooms!', rating: 5 },
    { id: 2, author: 'Priya Singh', text: 'Helpful staff and quick support.', rating: 4 },
  ])
  const [hostels, setHostels] = useState([])
  const [selectedHostelId, setSelectedHostelId] = useState('')
  const selectedHostel = hostels.find((h) => h._id === selectedHostelId)
  const [roomsOpen, setRoomsOpen] = useState(false)
  const [rooms, setRooms] = useState([])
  const [roomCapacityFilter, setRoomCapacityFilter] = useState('all')
  const [roomsTab, setRoomsTab] = useState('rooms') // rooms | security
  const [tenantRequests, setTenantRequests] = useState([
    { id: 'REQ-001', name: 'Aman Sharma', hostel: 'Green Valley', roomType: 'Single' },
    { id: 'REQ-002', name: 'Neha Verma', hostel: 'City Nest', roomType: 'Shared' },
  ])

  // Derived dashboard stats from real hostels data
  const stats = {
    activeHostels: hostels.length,
    roomsAvailable: hostels.reduce((sum, h) => sum + (h.availableRooms || 0), 0),
    pendingVerifications: hostels.filter((h) => h.verificationStatus === 'pending').length,
    tenantRequests: tenantRequests.length,
  }
  const handlePickMedia = (e) => {
    const files = Array.from(e.target.files || [])
    const prepared = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image',
    }))
    setMediaFiles((prev) => [...prev, ...prepared])
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const files = Array.from(e.dataTransfer.files || [])
    const prepared = files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      type: file.type.startsWith('video') ? 'video' : 'image',
    }))
    setMediaFiles((prev) => [...prev, ...prepared])
  }

  const removeMedia = (idx) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== idx))
  }

  const fakeUpload = async () => {
    if (!selectedHostelId) {
      setCreateMessage('Please select a hostel to upload media.')
      setTimeout(() => setCreateMessage(''), 2000)
      return
    }
    try {
      const files = mediaFiles.map((m) => m.file)
      await ownerAPI.uploadHostelMedia(selectedHostelId, files)
      setCreateMessage('Media uploaded successfully.')
      setMediaFiles([])
      // refresh hostels to reflect new media
      const res = await ownerAPI.getMyHostels()
      const list = res.data?.data || []
      setHostels(list)
      if (list.length > 0 && !list.find(h => h._id === selectedHostelId)) {
        setSelectedHostelId(list[0]._id)
      }
      setTimeout(() => setCreateMessage(''), 2000)
    } catch (e) {
      setCreateMessage(e.response?.data?.message || 'Upload failed')
      setTimeout(() => setCreateMessage(''), 2500)
    }
  }

  useEffect(() => {
    // Load owner's hostels
    ownerAPI.getMyHostels()
      .then((res) => {
        const list = res.data?.data || []
        setHostels(list)
        if (list.length > 0) setSelectedHostelId(list[0]._id)
      })
      .catch(() => {
        // If API fails, keep empty list; UI will still function
      })
  }, [])

  const openRoomsPanel = async (hostelId) => {
    setSelectedHostelId(hostelId)
    setRoomsOpen(true)
    setRoomsTab('rooms')
    try {
      const res = await ownerAPI.getHostelRooms(hostelId)
      setRooms(res.data?.data || [])
    } catch {
      setRooms([])
    }
  }

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
    <>
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
                  <h3 className="text-3xl font-bold text-primary">{stats.activeHostels}</h3>
                </div>
                <div className="stats-card">
                  <p className="text-text-muted text-sm mb-2">Rooms Available</p>
                  <h3 className="text-3xl font-bold text-accent">{stats.roomsAvailable}</h3>
                </div>
                <div className="stats-card">
                  <p className="text-text-muted text-sm mb-2">Pending Verifications</p>
                  <h3 className="text-3xl font-bold text-orange-500">{stats.pendingVerifications}</h3>
                </div>
                <div className="stats-card">
                  <p className="text-text-muted text-sm mb-2">Tenant Requests</p>
                  <h3 className="text-3xl font-bold text-blue-600">{stats.tenantRequests}</h3>
                </div>
              </div>

              <div className="card">
                <h3 className="text-2xl font-bold mb-4 text-text-dark">Quick Actions</h3>
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    className="btn-primary"
                    onClick={() => setActiveTab('create')}
                  >
                    Create New Hostel
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => setActiveTab('tenants')}
                  >
                    View Tenant Requests
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => setActiveTab('media')}
                  >
                    Upload Media
                  </button>
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
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">City</th>
                      <th className="px-4 py-2 text-left">Rooms</th>
                      <th className="px-4 py-2 text-left">Available</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {hostels.map((h) => (
                      <tr className="border-b" key={h._id}>
                        <td className="px-4 py-2">{h._id}</td>
                        <td className="px-4 py-2">{h.name}</td>
                        <td className="px-4 py-2">{h.address?.city || '-'}</td>
                        <td className="px-4 py-2">{h.totalRooms ?? '-'}</td>
                        <td className="px-4 py-2">{h.availableRooms ?? '-'}</td>
                        <td className="px-4 py-2 space-x-2">
                          <button
                            className="text-primary text-sm hover:underline"
                            onClick={async () => {
                              const newName = prompt('Update hostel name', h.name)
                              if (newName && newName !== h.name) {
                                await ownerAPI.updateHostel(h._id, { name: newName })
                                const res = await ownerAPI.getMyHostels()
                                const list = res.data?.data || []
                                setHostels(list)
                              }
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="reject-btn text-xs"
                            onClick={async () => {
                              if (!confirm('Delete this hostel? This will remove its rooms and media.')) return
                              await ownerAPI.deleteHostel(h._id)
                              const res = await ownerAPI.getMyHostels()
                              const list = res.data?.data || []
                              setHostels(list)
                            }}
                          >
                            Delete
                          </button>
                          <button
                            className="btn-secondary text-xs"
                            onClick={() => openRoomsPanel(h._id)}
                          >
                            Manage Rooms
                          </button>
                          <button
                            className="approve-btn text-xs"
                            onClick={async () => {
                              setSelectedHostelId(h._id)
                              setActiveTab('media')
                            }}
                          >
                            Manage Media
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="card max-w-4xl">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Create New Hostel</h3>
              {createMessage && (
                <div className="mb-4 p-3 bg-success/10 border border-success text-success rounded-lg text-sm">
                  {createMessage}
                </div>
              )}
              <form
                className="space-y-4"
                onSubmit={async (e) => {
                  e.preventDefault()
                  try {
                    const payload = {
                      name: createForm.name,
                      address: createForm.address,
                      description: createForm.description,
                      hostelType: createForm.hostelType,
                      priceRange: {
                        min: Number(createForm.priceRange.min) || 0,
                        max: Number(createForm.priceRange.max) || 0,
                      },
                    }
                    await ownerAPI.createHostel(payload)
                    setCreateMessage('Hostel created successfully.')
                    // reload list
                    const res = await ownerAPI.getMyHostels()
                    const list = res.data?.data || []
                    setHostels(list)
                    if (list.length > 0) setSelectedHostelId(list[0]._id)
                    // reset form
                    setCreateForm({
                      name: '',
                      address: { street: '', city: '', state: '', pincode: '' },
                      description: '',
                      hostelType: 'boys',
                      priceRange: { min: '', max: '' },
                    })
                    setTimeout(() => setCreateMessage(''), 2500)
                  } catch (err) {
                    setCreateMessage(err.response?.data?.message || 'Failed to create hostel')
                    setTimeout(() => setCreateMessage(''), 3000)
                  }
                }}
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Hostel Name"
                    className="input"
                    value={createForm.name}
                    onChange={(e) => setCreateForm((f) => ({ ...f, name: e.target.value }))}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Street"
                    className="input"
                    value={createForm.address.street}
                    onChange={(e) => setCreateForm((f) => ({ ...f, address: { ...f.address, street: e.target.value } }))}
                  />
                  <input
                    type="text"
                    placeholder="City"
                    className="input"
                    value={createForm.address.city}
                    onChange={(e) => setCreateForm((f) => ({ ...f, address: { ...f.address, city: e.target.value } }))}
                  />
                  <input
                    type="text"
                    placeholder="State"
                    className="input"
                    value={createForm.address.state}
                    onChange={(e) => setCreateForm((f) => ({ ...f, address: { ...f.address, state: e.target.value } }))}
                  />
                  <input
                    type="text"
                    placeholder="Pincode"
                    className="input"
                    value={createForm.address.pincode}
                    onChange={(e) => setCreateForm((f) => ({ ...f, address: { ...f.address, pincode: e.target.value } }))}
                  />
                  <select
                    className="input"
                    value={createForm.hostelType}
                    onChange={(e) => setCreateForm((f) => ({ ...f, hostelType: e.target.value }))}
                  >
                    <option value="boys">Boys Only</option>
                    <option value="girls">Girls Only</option>
                    <option value="coed">Co-ed</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Min Price (₹)"
                    className="input"
                    value={createForm.priceRange.min}
                    onChange={(e) => setCreateForm((f) => ({ ...f, priceRange: { ...f.priceRange, min: e.target.value } }))}
                  />
                  <input
                    type="number"
                    placeholder="Max Price (₹)"
                    className="input"
                    value={createForm.priceRange.max}
                    onChange={(e) => setCreateForm((f) => ({ ...f, priceRange: { ...f.priceRange, max: e.target.value } }))}
                  />
                </div>
                <textarea
                  placeholder="Description"
                  className="input w-full h-32"
                  value={createForm.description}
                  onChange={(e) => setCreateForm((f) => ({ ...f, description: e.target.value }))}
                />
                <button type="submit" className="submit-btn">Create Hostel</button>
              </form>
            </div>
          )}

          {activeTab === 'tenants' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Tenant Management</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="px-4 py-2 text-left">Request</th>
                      <th className="px-4 py-2 text-left">Name</th>
                      <th className="px-4 py-2 text-left">Hostel</th>
                      <th className="px-4 py-2 text-left">Room Type</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tenantRequests.map((r) => (
                      <tr className="border-b" key={r.id}>
                        <td className="px-4 py-2">{r.id}</td>
                        <td className="px-4 py-2">{r.name}</td>
                        <td className="px-4 py-2">{r.hostel}</td>
                        <td className="px-4 py-2">{r.roomType}</td>
                        <td className="px-4 py-2 space-x-2">
                          <button className="approve-btn">Approve</button>
                          <button className="reject-btn">Reject</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'media' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Upload 360° Media</h3>

              <div
                className="upload-btn mb-4"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => document.getElementById('mediaPicker')?.click()}
              >
                <div className="mb-3">
                  <label className="block text-sm font-medium text-text-dark mb-1">Select Hostel</label>
                  <select
                    className="input"
                    value={selectedHostelId}
                    onChange={(e) => setSelectedHostelId(e.target.value)}
                  >
                    <option value="">-- Choose a hostel --</option>
                    {hostels.map((h) => (
                      <option key={h._id} value={h._id}>{h.name}</option>
                    ))}
                  </select>
                </div>
                <p className="text-text-muted text-center">
                  Drag & drop photos/videos here or click to select
                </p>
                <input
                  id="mediaPicker"
                  type="file"
                  className="hidden"
                  accept="image/*,video/*"
                  multiple
                  onChange={handlePickMedia}
                />
              </div>

              {mediaFiles.length > 0 && (
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  {mediaFiles.map((m, idx) => (
                    <div className="relative" key={idx}>
                      {m.type === 'video' ? (
                        <video src={m.url} className="w-full rounded-lg" controls />
                      ) : (
                        <img src={m.url} alt="preview" className="w-full rounded-lg" />
                      )}
                      <button
                        className="reject-btn absolute top-2 right-2 text-xs px-2 py-1"
                        onClick={() => removeMedia(idx)}
                        type="button"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {selectedHostel && (selectedHostel.photos?.length > 0 || selectedHostel.video360?.length > 0) && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-text-dark">
                    Current Media ({selectedHostel.photos?.length || 0} photos, {selectedHostel.video360?.length || 0} videos)
                  </h4>
                  <div className="grid md:grid-cols-4 gap-3">
                    {(selectedHostel.photos || []).slice(0, 8).map((p) => (
                      <div key={p.publicId} className="relative">
                        <img src={p.url} className="w-full rounded-lg" alt="hostel" />
                        <button
                          className="reject-btn absolute top-2 right-2 text-xs px-2 py-1"
                          type="button"
                          onClick={async () => {
                            await ownerAPI.deleteMedia(selectedHostel._id, p.publicId)
                            const res = await ownerAPI.getMyHostels()
                            setHostels(res.data?.data || [])
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                    {(selectedHostel.video360 || []).slice(0, 4).map((v) => (
                      <div key={v.publicId} className="relative">
                        <video src={v.url} className="w-full rounded-lg" controls />
                        <button
                          className="reject-btn absolute top-2 right-2 text-xs px-2 py-1"
                          type="button"
                          onClick={async () => {
                            await ownerAPI.deleteMedia(selectedHostel._id, v.publicId)
                            const res = await ownerAPI.getMyHostels()
                            setHostels(res.data?.data || [])
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  className="btn-accent"
                  onClick={fakeUpload}
                  type="button"
                  disabled={mediaFiles.length === 0}
                >
                  Upload Selected ({mediaFiles.length})
                </button>
                <button
                  className="btn-secondary"
                  type="button"
                  onClick={() => setMediaFiles([])}
                >
                  Clear
                </button>
              </div>
            </div>
          )}

          {activeTab === 'feedback' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Feedback</h3>
              <div className="space-y-3">
                {feedbacks.map((f) => (
                  <div key={f.id} className="border rounded-lg p-3">
                    <div className="flex justify-between">
                      <p className="font-semibold">{f.author}</p>
                      <p className="text-yellow-600">⭐ {f.rating}</p>
                    </div>
                    <p className="text-text-muted text-sm mt-1">{f.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="card">
              <h3 className="text-2xl font-bold mb-4 text-text-dark">Profile Settings</h3>
              <form
                className="space-y-4 max-w-xl"
                onSubmit={async (e) => {
                  e.preventDefault()
                  try {
                    await ownerAPI.getMyHostels() // keep token fresh via interceptor
                    // Save basic fields via auth profile endpoint
                    const payload = {}
                    if (profile.displayName) payload.name = profile.displayName
                    if (profile.contact) payload.phone = profile.contact
                    await (await import('../../services/api')).authAPI.updateProfile(payload)
                    setCreateMessage('Profile saved successfully.')
                    setTimeout(() => setCreateMessage(''), 2000)
                  } catch (err) {
                    setCreateMessage(err.response?.data?.message || 'Failed to save profile')
                    setTimeout(() => setCreateMessage(''), 2500)
                  }
                }}
              >
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">
                    Display Name
                  </label>
                  <input
                    className="input w-full"
                    value={profile.displayName}
                    onChange={(e) => setProfile((p) => ({ ...p, displayName: e.target.value }))}
                    placeholder={user?.name || 'Your name'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-dark mb-1">
                    Contact Number
                  </label>
                  <input
                    className="input w-full"
                    value={profile.contact}
                    onChange={(e) => setProfile((p) => ({ ...p, contact: e.target.value }))}
                    placeholder="9876543210"
                  />
                </div>
                <button className="submit-btn" type="submit">
                  Save Changes
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>

    {/* Rooms Drawer/Modal */}
    {roomsOpen && (
      <div className="fixed inset-0 bg-black/40 z-50 flex">
        <div className="ml-auto w-full md:w-[720px] h-full bg-white shadow-xl flex flex-col">
          <div className="p-4 border-b flex items-center justify-between">
            <h3 className="text-xl font-bold text-text-dark">
              {hostels.find(h => h._id === selectedHostelId)?.name} - Rooms & Security
            </h3>
            <button className="text-primary" onClick={() => setRoomsOpen(false)}>
              Close
            </button>
          </div>

          <div className="px-4 pt-3 flex gap-2">
            <button
              className={`px-3 py-2 rounded ${roomsTab === 'rooms' ? 'bg-primary text-white' : 'bg-gray-100 text-text-dark'}`}
              onClick={() => setRoomsTab('rooms')}
            >
              Rooms
            </button>
            <button
              className={`px-3 py-2 rounded ${roomsTab === 'security' ? 'bg-primary text-white' : 'bg-gray-100 text-text-dark'}`}
              onClick={() => setRoomsTab('security')}
            >
              Security & Emergency
            </button>
          </div>

          {roomsTab === 'rooms' && (
            <div className="p-4 overflow-auto">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <label className="text-sm text-text-muted">Capacity</label>
                  <select
                    className="input"
                    value={roomCapacityFilter}
                    onChange={(e) => setRoomCapacityFilter(e.target.value)}
                  >
                    <option value="all">All</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                  </select>
                </div>
                <button
                  className="btn-primary"
                  onClick={async () => {
                    // Simple create prompt to avoid UI changes
                    const roomNumber = prompt('Room number')
                    const floor = Number(prompt('Floor') || '1')
                    const roomType = prompt('Room type (single, double, triple, quad)') || 'single'
                    const capacity = Number(prompt('Capacity') || '1')
                    const rent = Number(prompt('Monthly Rent') || '0')
                    const securityDeposit = Number(prompt('Security Deposit') || '0')
                    if (!roomNumber) return
                    await ownerAPI.createRoom(selectedHostelId, {
                      roomNumber, floor, roomType, capacity, rent, securityDeposit, amenities: []
                    })
                    const res = await ownerAPI.getHostelRooms(selectedHostelId)
                    setRooms(res.data?.data || [])
                  }}
                >
                  Add Room
                </button>
              </div>

              <div className="space-y-4">
                {rooms
                  .filter(r => roomCapacityFilter === 'all' || String(r.capacity) === roomCapacityFilter)
                  .map((r) => (
                  <div key={r._id} className="card">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-lg font-bold text-text-dark">
                          Room {r.roomNumber} • {r.roomType.toUpperCase()} • Capacity {r.capacity}
                        </h4>
                        <p className="text-text-muted text-sm">
                          Floor {r.floor} • Rent ₹{r.rent} • Deposit ₹{r.securityDeposit} • {r.isAvailable ? 'Available' : 'Occupied'}
                        </p>
                        <p className="text-sm mt-1">
                          Amenities: {(r.amenities || []).length > 0 ? r.amenities.join(', ') : '—'}
                          {r.amenities?.includes('Attached Bathroom') ? ' • Washroom: Attached' : ' • Washroom: Common/Not specified'}
                        </p>
                      </div>
                      <div className="space-x-2">
                        <button
                          className="text-primary text-sm hover:underline"
                          onClick={async () => {
                            const newRent = Number(prompt('Update monthly rent', String(r.rent)) || r.rent)
                            if (!Number.isNaN(newRent)) {
                              await ownerAPI.updateRoom(r._id, { rent: newRent })
                              const res = await ownerAPI.getHostelRooms(selectedHostelId)
                              setRooms(res.data?.data || [])
                            }
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="reject-btn text-xs"
                          onClick={async () => {
                            if (!confirm('Delete this room?')) return
                            await ownerAPI.deleteRoom(r._id)
                            const res = await ownerAPI.getHostelRooms(selectedHostelId)
                            setRooms(res.data?.data || [])
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>

                    {(r.photos || []).length > 0 && (
                      <div className="grid md:grid-cols-4 gap-3 mt-3">
                        {r.photos.slice(0, 8).map((p) => (
                          <img key={p.publicId} src={p.url} alt="room" className="w-full rounded-lg" />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {roomsTab === 'security' && (
            <div className="p-4 overflow-auto space-y-4">
              <div className="card">
                <h4 className="text-xl font-bold text-text-dark mb-2">Hostel Security</h4>
                <ul className="list-disc pl-6 text-text-muted">
                  <li>CCTV coverage in common areas</li>
                  <li>24/7 on-site guard</li>
                  <li>Visitor logbook and ID verification</li>
                  <li>Emergency exit routes displayed on each floor</li>
                </ul>
              </div>

              <div className="card">
                <h4 className="text-xl font-bold text-text-dark mb-2">Nearby Emergency Services</h4>
                <p className="text-text-muted mb-2">
                  Based on city: {hostels.find(h => h._id === selectedHostelId)?.address?.city || '—'}
                </p>
                <ul className="list-disc pl-6 text-text-muted">
                  <li>Police Station: within 1.2 km</li>
                  <li>Hospital (Emergency): within 2.1 km</li>
                  <li>Fire Station: within 3.0 km</li>
                </ul>
                <p className="text-sm text-text-muted mt-2">Tip: We can integrate a live map and fetch exact nearby services if you provide a maps API key.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    )}
    </>
  )
}
