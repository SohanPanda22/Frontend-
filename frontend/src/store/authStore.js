import { create } from 'zustand'
import { authAPI } from '../services/api'

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,

  setUser: (user) => {
    set({ user })
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  },

  setToken: (token) => {
    set({ token, isAuthenticated: !!token })
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  },

  login: async (credentials) => {
    set({ loading: true, error: null })
    try {
      const response = await authAPI.login(credentials)
      const { token, user } = response.data.data
      set({ token, user, isAuthenticated: true })
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Login failed'
      set({ error: errorMsg, loading: false })
      throw error
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null })
    try {
      const response = await authAPI.register(userData)
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Registration failed'
      set({ error: errorMsg, loading: false })
      throw error
    }
  },

  verifyOTP: async (otpData) => {
    console.log('[AUTH STORE] Starting OTP verification with:', otpData)
    set({ loading: true, error: null })
    try {
      console.log('[AUTH STORE] Making API call to verify OTP')
      const response = await authAPI.verifyOTP(otpData)
      console.log('[AUTH STORE] API response:', response.data)
      const { token, user } = response.data.data
      console.log('[AUTH STORE] Extracted token and user:', { token, user })
      set({ token, user, isAuthenticated: true, loading: false })
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      return response.data
    } catch (error) {
      console.error('[AUTH STORE] OTP verification error:', error)
      const errorMsg = error.response?.data?.message || 'OTP verification failed'
      set({ error: errorMsg, loading: false })
      throw error
    }
  },

  resendOTP: async (otpData) => {
    set({ loading: true, error: null })
    try {
      const response = await authAPI.resendOTP(otpData)
      set({ loading: false })
      return response.data
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Failed to resend OTP'
      set({ error: errorMsg, loading: false })
      throw error
    }
  },

  logout: () => {
    set({ user: null, token: null, isAuthenticated: false })
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  clearError: () => set({ error: null }),
}))
