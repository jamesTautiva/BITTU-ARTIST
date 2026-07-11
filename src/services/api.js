// BITU ARTIST API Client
// Conexión con BITU-API backend

import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://bitu-api.onrender.com/api'

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL
  }

  getToken() {
    try {
      const authData = localStorage.getItem('auth-storage')
      if (authData) {
        const parsed = JSON.parse(authData)
        const token = parsed.state?.user?.token || null
        return token
      }
    } catch (e) {
      console.error('Error parsing auth token:', e)
    }
    return null
  }

  getHeaders(contentType = 'application/json') {
    const headers = {}
    if (contentType) {
      headers['Content-Type'] = contentType
    }
    const token = this.getToken()
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return headers
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      ...this.getHeaders(),
      ...options.headers,
    }
    
    const config = {
      ...options,
      headers,
    }

    // Debug logging para artist/create
    if (endpoint === '/artist/create') {
      console.log('=== ARTIST CREATE DEBUG ===')
      console.log('URL:', url)
      console.log('Headers:', headers)
      console.log('Config:', config)
      console.log('Data:', config.data)
      console.log('==========================')
    }

    try {
      const response = await axios(url, config)
      return response.data
    } catch (error) {
      if (error.response) {
        throw new ApiError(
          error.response.data?.message || `HTTP Error: ${error.response.status}`,
          error.response.status,
          error.response.data
        )
      }
      throw new ApiError(
        error.message || 'Error de conexión con el servidor',
        0,
        { originalError: error }
      )
    }
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' })
  }

  post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      data: JSON.stringify(data)
    })
  }

  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      data: JSON.stringify(data)
    })
  }

  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' })
  }

  upload(endpoint, formData) {
    return this.request(endpoint, {
      method: 'POST',
      data: formData,
      headers: this.getHeaders('multipart/form-data')
    })
  }
}

class ApiError extends Error {
  constructor(message, status, data) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

const api = new ApiClient()

// Artist Services
export const artistService = {
  getProfile: () => api.get('/artist/profile'),
  updateProfile: (data) => api.put('/artist/profile', data),
  getStats: () => api.get('/artist/stats'),
  getAnalytics: (timeRange) => api.get(`/artist/analytics?range=${timeRange}`),
  uploadSong: (formData) => api.upload('/song/upload', formData),
  getSongs: () => api.get('/song/all'),
  updateSong: (id, data) => api.put(`/song/update/${id}`, data),
  deleteSong: (id) => api.delete(`/song/delete/${id}`),
  getAlbums: () => api.get('/album/all'),
  getAlbumsByArtistId: (artistId) => api.get(`/album/artist/${artistId}`),
  createAlbum: (data) => api.post('/album/create', data),
  updateAlbum: (id, data) => api.put(`/album/update/${id}`, data),
  deleteAlbum: (id) => api.delete(`/album/delete/${id}`)
}

// Auth Services
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.post('/auth/change-password', data)
}

// Onboarding Services for Artists
export const onboardingService = {
  // Step 1: Upload User Avatar
  uploadAvatar: (userId, file) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return api.upload(`/upload/avatar/${userId}`, formData)
  },

  // Step 2: Create Artist Profile
  createArtist: (artistData) => api.post('/artist/create', artistData),

  // Step 3: Upload Artist Image
  uploadArtistImage: (artistId, file) => {
    const formData = new FormData()
    formData.append('artist_image', file)
    return api.upload(`/upload/artist-image/${artistId}`, formData)
  },

  // Step 4: Add Band Members
  addBandMember: (memberData) => api.post('/artist/members/create', memberData),
  getBandMembers: (artistId) => {
    console.log('=== API DEBUG: Getting all members and filtering by artist ===', artistId)
    return api.get('/artist/members/all').then(response => {
      const filteredMembers = response.filter(member => member.artist_id === artistId)
      console.log('=== API DEBUG: Filtered members ===', filteredMembers)
      return filteredMembers
    })
  },
  updateBandMember: (memberId, data) => api.put(`/artist/members/update/${memberId}`, data),
  deleteBandMember: (memberId) => api.delete(`/artist/members/delete/${memberId}`),

  // Step 5: Legal Documentation
  acceptLegalDocument: (userId, documentId) => api.post('/legal-acceptance/create', {
    userId,
    legalDocumentId: documentId
  }),
  checkLegalAcceptance: (userId, documentId) => api.get(`/legal-acceptance/check/${userId}/${documentId}`),
  getLegalDocuments: () => api.get('/legal-acceptance/all'),
  getUserLegalAcceptances: (userId) => api.get(`/legal-acceptance/user/${userId}`),

  // Helper: Get current user data
  getCurrentUser: () => {
    console.log('=== API DEBUG: Getting user from localStorage (fallback) ===')
    // Fallback: obtener datos del localStorage y añadir avatar_url si existe
    const authStorage = localStorage.getItem('auth-storage')
    if (authStorage) {
      try {
        const auth = JSON.parse(authStorage)
        return auth.state.user
      } catch (err) {
        console.error('Error parsing auth storage:', err)
        return null
      }
    }
    return null
  },

  // Helper: Get all artists
  getArtists: () => {
    console.log('=== API DEBUG: Calling /artist/all ===')
    return api.get('/artist/all')
  },
  
  // Helper: Get current artist by user
  getArtistByUserId: (userId) => api.get(`/artist/by-user/${userId}`),

  // Helper: Complete onboarding
  completeOnboarding: (userId) => api.put(`/auth/profile/${userId}`, { 
    onboarding_completed: true 
  })
}

// Analytics Services
export const analyticsService = {
  getDashboardStats: () => api.get('/analytics/dashboard'),
  getPlayStats: (timeRange) => api.get(`/analytics/plays?range=${timeRange}`),
  getListenerStats: (timeRange) => api.get(`/analytics/listeners?range=${timeRange}`),
  getRevenueStats: (timeRange) => api.get(`/analytics/revenue?range=${timeRange}`),
  getTopSongs: (limit = 10) => api.get(`/analytics/top-songs?limit=${limit}`),
  exportData: (type, timeRange) => api.get(`/analytics/export/${type}?range=${timeRange}`)
}

export default api
