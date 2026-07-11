import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../app/store'
import { useThemeStore } from '../../../app/store'
import { onboardingService } from '../../../services/api'
import { Music, User, ArrowRight, Briefcase } from 'lucide-react'

function ArtistProfilePage() {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  const [formData, setFormData] = useState({
    name: '',
    bio: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre artístico es requerido'
    }
    
    if (formData.bio && formData.bio.length > 500) {
      errors.bio = 'La biografía no puede exceder 500 caracteres'
    }
    
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      setError('Por favor completa los campos requeridos')
      return
    }

    setLoading(true)
    setError('')

    try {
      // Validar que tengamos el user_id
      if (!user || !user.id) {
        throw new Error('No se encontró información del usuario. Por favor inicia sesión nuevamente.')
      }

      console.log('User data:', user)
      console.log('User ID:', user.id)

      // Crear perfil de artista en el backend
      const artistData = {
        name: formData.name,
        user_id: user.id,
        bio: formData.bio
      }

      console.log('Artist data to send:', artistData)
      console.log('Token available:', !!user.token)
      console.log('Full user object:', user)

      const response = await onboardingService.createArtist(artistData)
      console.log('Artist created successfully:', response)
      
      // Guardar el ID del artista para los siguientes pasos
      localStorage.setItem('current_artist_id', response.id)
      
      // Redirigir al siguiente paso
      navigate('/onboarding/artist-image')
    } catch (err) {
      console.error('Full error object:', err)
      console.error('Error response:', err.response?.data)
      console.error('Error status:', err.response?.status)
      
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          err.message || 
                          'Error al crear perfil de artista. Intenta nuevamente.'
      
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const skipForNow = () => {
    navigate('/onboarding/artist-image')
  }

  const continueAnyway = () => {
    // Guardar el user_id como artist_id temporal para continuar el flujo
    localStorage.setItem('current_artist_id', user.id)
    localStorage.setItem('artist_profile_skipped', 'true')
    navigate('/onboarding/artist-image')
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
        maxWidth: '600px',
        background: isDark ? '#1f2937' : '#fff',
        borderRadius: '16px',
        padding: '40px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Briefcase size={40} color="#dc2626" />
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            margin: 0,
            color: isDark ? '#fff' : '#111'
          }}>
            Crea tu Perfil de Artista
          </h1>
          <p style={{
            fontSize: '16px',
            color: isDark ? '#9ca3af' : '#6b7280',
            margin: '8px 0 0 0'
          }}>
            Configura tu identidad musical profesional
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '8px',
            gap: '8px'
          }}>
            {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
              <div key={stepNumber} style={{
                width: '32px',
                height: '4px',
                background: stepNumber <= 3 ? '#dc2626' : (isDark ? '#374151' : '#e5e7eb'),
                borderRadius: '2px',
                transition: 'background 0.3s ease'
              }} />
            ))}
          </div>
          <div style={{
            textAlign: 'center',
            fontSize: '12px',
            color: isDark ? '#9ca3af' : '#6b7280',
            fontWeight: 500
          }}>
            Paso 3 de 6 - Perfil de Artista
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Nombre Artístico */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              color: isDark ? '#fff' : '#111',
              marginBottom: '8px'
            }}>
              Nombre Artístico *
            </label>
            <div style={{ position: 'relative' }}>
              <User size={18} style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: isDark ? '#6b7280' : '#9ca3af'
              }} />
              <input
                type="text"
                name="name"
                placeholder="Tu nombre como artista"
                value={formData.name}
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

          {/* Biografía */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: 500,
              color: isDark ? '#fff' : '#111',
              marginBottom: '8px'
            }}>
              Biografía
            </label>
            <textarea
              name="bio"
              placeholder="Cuéntanos sobre tu música, influencias y historia..."
              value={formData.bio}
              onChange={handleChange}
              maxLength={500}
              rows={4}
              style={{
                width: '100%',
                padding: '12px',
                background: isDark ? '#111' : '#f9fafb',
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px',
                color: isDark ? '#fff' : '#111',
                fontSize: '14px',
                resize: 'vertical',
                fontFamily: 'inherit'
              }}
            />
            <div style={{
              fontSize: '12px',
              color: isDark ? '#6b7280' : '#9ca3af',
              textAlign: 'right',
              marginTop: '4px'
            }}>
              {formData.bio.length}/500 caracteres
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginBottom: '24px',
              color: '#ef4444',
              fontSize: '14px'
            }}>
              {error}
              {error.includes('user_id') && (
                <div style={{ marginTop: '8px', fontSize: '12px' }}>
                  Puedes continuar con el onboarding y configurar tu perfil más tarde.
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px'
          }}>
            <button
              type="button"
              onClick={skipForNow}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                color: isDark ? '#9ca3af' : '#6b7280',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Omitir por ahora
            </button>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 32px',
                  background: loading ? '#9ca3af' : '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid #fff',
                      borderTop: '2px solid transparent',
                      borderRight: '2px solid transparent',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }} />
                    Creando perfil...
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              {error && (
                <button
                  type="button"
                  onClick={continueAnyway}
                  style={{
                    padding: '12px 24px',
                    background: '#6b7280',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Continuar igualmente
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ArtistProfilePage
