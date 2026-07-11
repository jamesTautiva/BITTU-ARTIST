import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '../../../app/store'
import { onboardingService } from '../../../services/api'
import { Music, Users, Plus, X, ArrowRight, UserPlus, Trash2 } from 'lucide-react'

function BandMembersPage() {
  const { theme } = useThemeStore()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  const [members, setMembers] = useState([
    { id: 1, name: '', role: 'other', instrument: '', bio: '' }
  ])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [artistId, setArtistId] = useState(null)

  const roles = [
    { value: 'vocalist', label: 'Vocalista' },
    { value: 'guitarist', label: 'Guitarrista' },
    { value: 'bassist', label: 'Bajista' },
    { value: 'drummer', label: 'Baterista' },
    { value: 'keyboardist', label: 'Tecladista' },
    { value: 'producer', label: 'Productor' },
    { value: 'dj', label: 'DJ' },
    { value: 'other', label: 'Otro' }
  ]

  useEffect(() => {
    // Obtener el artist_id del localStorage
    const storedArtistId = localStorage.getItem('current_artist_id')
    if (!storedArtistId) {
      setError('No se encontró el ID del artista. Por favor regresa y completa los pasos anteriores.')
      return
    }
    setArtistId(storedArtistId)
  }, [])

  const addMember = () => {
    const newId = Math.max(...members.map(m => m.id)) + 1
    setMembers([...members, { id: newId, name: '', role: 'other', instrument: '', bio: '' }])
  }

  const removeMember = (id) => {
    if (members.length > 1) {
      setMembers(members.filter(member => member.id !== id))
    }
  }

  const updateMember = (id, field, value) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ))
  }

  const validateForm = () => {
    const validMembers = members.filter(member => member.name.trim() !== '')
    
    if (validMembers.length === 0) {
      setError('Debes agregar al menos un miembro con nombre')
      return false
    }

    for (const member of validMembers) {
      if (!member.name.trim()) {
        setError('Todos los miembros deben tener un nombre')
        return false
      }
      if (!member.role) {
        setError('Todos los miembros deben tener un rol')
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    if (!artistId) {
      setError('No se encontró el ID del artista')
      return
    }

    setLoading(true)

    try {
      // Filtrar miembros que tienen nombre (no están vacíos)
      const validMembers = members.filter(member => member.name.trim() !== '')

      // Enviar cada miembro al backend
      const promises = validMembers.map(member => 
        onboardingService.addBandMember({
          artist_id: parseInt(artistId),
          name: member.name.trim(),
          role: member.role,
          instrument: member.instrument.trim(),
          bio: member.bio.trim()
        })
      )

      await Promise.all(promises)
      
      // Redirigir al siguiente paso
      navigate('/onboarding/legal')
    } catch (err) {
      setError(err.message || 'Error al registrar miembros de la banda. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const skipForNow = () => {
    navigate('/onboarding/legal')
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
        maxWidth: '800px',
        background: isDark ? '#1f2937' : '#fff',
        borderRadius: '16px',
        padding: '40px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Users size={40} color="#dc2626" />
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            margin: 0,
            color: isDark ? '#fff' : '#111'
          }}>
            Miembros de la Banda
          </h1>
          <p style={{
            fontSize: '16px',
            color: isDark ? '#9ca3af' : '#6b7280',
            margin: '8px 0 0 0'
          }}>
            Agrega a los miembros que forman parte de tu proyecto musical
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
                background: stepNumber <= 5 ? '#dc2626' : (isDark ? '#374151' : '#e5e7eb'),
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
            Paso 5 de 6 - Miembros de la Banda
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          {/* Members List */}
          <div style={{ marginBottom: '24px' }}>
            {members.map((member, index) => (
              <div key={member.id} style={{
                background: isDark ? '#111' : '#f9fafb',
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px'
              }}>
                {/* Member Header */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <UserPlus size={20} color="#dc2626" />
                    <span style={{
                      fontSize: '16px',
                      fontWeight: 600,
                      color: isDark ? '#fff' : '#111'
                    }}>
                      Miembro {index + 1}
                    </span>
                  </div>
                  
                  {members.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMember(member.id)}
                      style={{
                        background: 'transparent',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '4px',
                        borderRadius: '4px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent'
                      }}
                    >
                      <Trash2 size={16} />
                      Eliminar
                    </button>
                  )}
                </div>

                {/* Member Fields */}
                <div style={{
                  display: 'grid',
                  gap: '16px',
                  gridTemplateColumns: '1fr 1fr'
                }}>
                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: isDark ? '#9ca3af' : '#6b7280',
                      marginBottom: '6px'
                    }}>
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) => updateMember(member.id, 'name', e.target.value)}
                      placeholder="Nombre del miembro"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: isDark ? '#1f2937' : '#fff',
                        color: isDark ? '#fff' : '#111'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: isDark ? '#9ca3af' : '#6b7280',
                      marginBottom: '6px'
                    }}>
                      Rol *
                    </label>
                    <select
                      value={member.role}
                      onChange={(e) => updateMember(member.id, 'role', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: isDark ? '#1f2937' : '#fff',
                        color: isDark ? '#fff' : '#111'
                      }}
                    >
                      {roles.map(role => (
                        <option key={role.value} value={role.value}>
                          {role.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: isDark ? '#9ca3af' : '#6b7280',
                      marginBottom: '6px'
                    }}>
                      Instrumento
                    </label>
                    <input
                      type="text"
                      value={member.instrument}
                      onChange={(e) => updateMember(member.id, 'instrument', e.target.value)}
                      placeholder="Ej: Guitarra eléctrica"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: isDark ? '#1f2937' : '#fff',
                        color: isDark ? '#fff' : '#111'
                      }}
                    />
                  </div>

                  <div>
                    <label style={{
                      display: 'block',
                      fontSize: '14px',
                      fontWeight: 500,
                      color: isDark ? '#9ca3af' : '#6b7280',
                      marginBottom: '6px'
                    }}>
                      Biografía
                    </label>
                    <input
                      type="text"
                      value={member.bio}
                      onChange={(e) => updateMember(member.id, 'bio', e.target.value)}
                      placeholder="Breve descripción"
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: isDark ? '#1f2937' : '#fff',
                        color: isDark ? '#fff' : '#111'
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Member Button */}
          <button
            type="button"
            onClick={addMember}
            style={{
              width: '100%',
              padding: '12px',
              background: 'transparent',
              border: `2px dashed ${isDark ? '#374151' : '#d1d5db'}`,
              borderRadius: '8px',
              color: isDark ? '#9ca3af' : '#6b7280',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginBottom: '24px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = '#dc2626'
              e.currentTarget.style.color = '#dc2626'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = isDark ? '#374151' : '#d1d5db'
              e.currentTarget.style.color = isDark ? '#9ca3af' : '#6b7280'
            }}
          >
            <Plus size={16} />
            Agregar otro miembro
          </button>

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
                  Guardando miembros...
                </>
              ) : (
                <>
                  Continuar
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default BandMembersPage
