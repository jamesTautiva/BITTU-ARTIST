import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../app/store'
import { useThemeStore } from '../../../app/store'
import { authService } from '../../../services/api'
import { Music, Mail, Lock, Eye, EyeOff } from 'lucide-react'

function Login() {
  const { theme } = useThemeStore()
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      console.log('=== LOGIN DEBUG: Attempting login with ===', formData)
      
      // Usar authService para login
      const response = await authService.login(formData)
      console.log('=== LOGIN DEBUG: Login response ===', response)

      // Guardar en el store de Zustand con estructura consistente
      const userData = {
        id: response.user?.id || response.id,
        username: response.user?.username || response.username,
        email: response.user?.email || response.email,
        role: response.user?.role || response.role || 'artist',
        avatar_url: response.user?.avatar_url || response.avatar_url,
        token: response.token || response.user?.token,
        // ✅ Agregar artist desde la respuesta
        artist: response.artist || null
      }
      console.log('=== LOGIN DEBUG: User data to save ===', userData)
      login(userData)
      
      // Redirigir al dashboard
      navigate('/app')
    } catch (err) {
      console.error('=== LOGIN DEBUG: Login error ===', err)
      setError(err.message || 'Error al iniciar sesión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isDark ? '#111' : '#f3f4f6',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        background: isDark ? '#1f2937' : '#fff',
        borderRadius: '16px',
        padding: '32px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '16px'
          }}>
            <Music size={48} color="#dc2626" />
          </div>
          <h1 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: isDark ? '#fff' : '#111',
            margin: '0 0 8px 0'
          }}>
            BITU ARTIST
          </h1>
          <p style={{
            fontSize: '14px',
            color: isDark ? '#9ca3af' : '#6b7280',
            margin: 0
          }}>
            Plataforma para artistas
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.1)',
              border: '1px solid rgba(220,38,38,0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '16px',
              color: '#ef4444',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <div style={{ marginBottom: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: isDark ? '#6b7280' : '#9ca3af'
              }} />
              <input
                type="email"
                name="email"
                placeholder="Correo electrónico"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  background: isDark ? '#111' : '#f9fafb',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDark ? '#fff' : '#111',
                  fontSize: '14px'
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: isDark ? '#6b7280' : '#9ca3af'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Contraseña"
                value={formData.password}
                onChange={handleChange}
                required
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  background: isDark ? '#111' : '#f9fafb',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  color: isDark ? '#fff' : '#111',
                  fontSize: '14px'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: isDark ? '#6b7280' : '#9ca3af'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px',
              background: '#dc2626',
              border: 'none',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '14px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
