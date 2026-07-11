import { useState, useEffect } from 'react'
import { useThemeStore } from '../../../app/store'
import { onboardingService } from '../../../services/api'
import { 
  User, 
  Music, 
  Calendar, 
  MapPin, 
  Edit, 
  Camera,
  Users,
  Settings,
  Mail,
  Link as LinkIcon,
  Shield,
  Clock
} from 'lucide-react'
import { EditMembers } from '../components/EditMembers'

function ProfilePage() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const [userData, setUserData] = useState(null)
  const [artistData, setArtistData] = useState(null)
  const [members, setMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadProfileData()
  }, [])

  const loadProfileData = async () => {
    try {
      setLoading(true)
      
      // Obtener datos del usuario desde localStorage
      const authStorage = localStorage.getItem('auth-storage')
      let user = null
      if (authStorage) {
        try {
          const auth = JSON.parse(authStorage)
          user = auth.state?.user
          console.log('=== PROFILE DEBUG: User data from localStorage ===', user)
          console.log('=== PROFILE DEBUG: User avatar_url ===', user?.avatar_url)
        console.log('=== PROFILE DEBUG: User complete data ===', JSON.stringify(user, null, 2))
        } catch (err) {
          console.error('Error parsing auth storage:', err)
        }
      } else {
        console.log('=== PROFILE DEBUG: No auth storage found ===')
      }

      if (!user) {
        setError('No se encontró información del usuario')
        return
      }

      setUserData(user)

      // Obtener datos actualizados del usuario (incluyendo avatar_url)
      try {
        console.log('=== PROFILE DEBUG: Fetching updated user data ===')
        const updatedUser = await onboardingService.getCurrentUser()
        console.log('=== PROFILE DEBUG: Updated user data ===', updatedUser)
        
        // Actualizar localStorage con los datos actualizados
        if (updatedUser) {
          const authStorage = localStorage.getItem('auth-storage')
          if (authStorage) {
            try {
              const auth = JSON.parse(authStorage)
              auth.state.user = { ...auth.state.user, ...updatedUser }
              localStorage.setItem('auth-storage', JSON.stringify(auth))
              setUserData(auth.state.user)
              console.log('=== PROFILE DEBUG: Updated user with avatar_url ===', auth.state.user.avatar_url)
            } catch (err) {
              console.error('Error updating user data:', err)
            }
          }
        }
      } catch (userErr) {
        console.warn('Error fetching updated user data:', userErr)
      }

      // Obtener datos del artista
      try {
        console.log('=== PROFILE DEBUG: Fetching artists ===')
        const artists = await onboardingService.getArtists()
        console.log('=== PROFILE DEBUG: All artists ===', artists)
        
        const userArtist = artists.find(artist => artist.user_id === user.id)
        console.log('=== PROFILE DEBUG: User artist ===', userArtist)
        
        if (userArtist) {
          setArtistData(userArtist)
          console.log('=== PROFILE DEBUG: User avatar_url ===', user.avatar_url)
        console.log('=== PROFILE DEBUG: Artist image URL ===', userArtist.artist_image)
          
          // Obtener miembros del artista
          try {
            console.log('=== PROFILE DEBUG: Fetching members for artist ===', userArtist.id)
            const artistMembers = await onboardingService.getBandMembers(userArtist.id)
            console.log('=== PROFILE DEBUG: Artist members ===', artistMembers)
            setMembers(artistMembers)
          } catch (memberErr) {
            console.warn('Error loading members:', memberErr)
            console.log('=== PROFILE DEBUG: Setting members to empty array ===')
            setMembers([])
          }
        } else {
          console.log('=== PROFILE DEBUG: No artist found for user ===', user.id)
        }
      } catch (artistErr) {
        console.warn('Error loading artist:', artistErr)
        setArtistData(null)
      }

    } catch (err) {
      setError('Error al cargar los datos del perfil')
      console.error('Profile load error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: isDark ? '#111' : '#f3f4f6'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #dc2626',
          borderTop: '4px solid transparent',
          borderRight: '4px solid transparent',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    )
  }

  if (error) {
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
          background: isDark ? '#1f2937' : '#fff',
          padding: '32px',
          borderRadius: '12px',
          textAlign: 'center',
          border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
        }}>
          <p style={{
            color: isDark ? '#fff' : '#111',
            marginBottom: '16px'
          }}>
            {error}
          </p>
          <button
            onClick={loadProfileData}
            style={{
              padding: '12px 24px',
              background: '#dc2626',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#111' : '#f3f4f6'
    }}>
      {/* Cover Section */}
      <div style={{
        position: 'relative',
        height: '320px',
        background: artistData?.artist_image 
          ? `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.5)), url(${artistData.artist_image})`
          : `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}>
        {/* Cover Actions */}
        <div style={{
          position: 'absolute',
          top: '16px',
          right: '16px',
          display: 'flex',
          gap: '8px'
        }}>
          <button
            style={{
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '20px',
              cursor: 'pointer',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Camera size={16} />
            Editar portada
          </button>
        </div>

        {/* Profile Picture */}
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '40px',
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: userData?.avatar_url 
            ? `url(${userData.avatar_url})`
            : `linear-gradient(135deg, #dc2626, #991b1b)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          border: '4px solid ' + (isDark ? '#111' : '#fff'),
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {!userData?.avatar_url && (
            <User size={40} color="#fff" />
          )}
          <button
            style={{
              position: 'absolute',
              bottom: '4px',
              right: '4px',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#dc2626',
              border: '2px solid ' + (isDark ? '#111' : '#fff'),
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Camera size={14} />
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '80px 20px 40px' }}>
        {/* Profile Header */}
        <div style={{
          background: isDark ? '#1f29376e' : '#fff',
          borderRadius: '12px',
          padding: '24px',
          marginBottom: '24px',
          border: `1px solid ${isDark ? '#513737' : '#e5e7eb'}`
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'start',
            marginBottom: '20px'
          }}>
            <div>
              <h1 style={{
                fontSize: '32px',
                fontWeight: 700,
                margin: '0 0 8px 0',
                color: isDark ? '#fff' : '#111'
              }}>
                {artistData?.name || userData?.username}
              </h1>
              <p style={{
                fontSize: '16px',
                color: isDark ? '#9ca3af' : '#6b7280',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Shield size={16} />
                Artista Verificado
              </p>
            </div>
            
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                style={{
                  padding: '10px 20px',
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Edit size={16} />
                Editar perfil
              </button>
              <button
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  color: isDark ? '#9ca3af' : '#6b7280',
                  border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Settings size={16} />
                Configuración
              </button>
            </div>
          </div>

          {/* Bio Section */}
          {artistData?.bio && (
            <div style={{
              padding: '16px',
              background: isDark ? '#111' : '#f9fafb',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <p style={{
                margin: 0,
                fontSize: '15px',
                lineHeight: '1.6',
                color: isDark ? '#e5e7eb' : '#374151'
              }}>
                {artistData.bio}
              </p>
            </div>
          )}

          {/* User Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '16px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: isDark ? '#111' : '#f9fafb',
              borderRadius: '8px'
            }}>
              <Mail size={20} color="#dc2626" />
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                  Correo electrónico
                </p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: isDark ? '#fff' : '#111' }}>
                  {userData?.email}
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: isDark ? '#111' : '#f9fafb',
              borderRadius: '8px'
            }}>
              <Calendar size={20} color="#dc2626" />
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                  Miembro desde
                </p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: isDark ? '#fff' : '#111' }}>
                  {new Date().toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              background: isDark ? '#111' : '#f9fafb',
              borderRadius: '8px'
            }}>
              <Music size={20} color="#dc2626" />
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                  Estado del artista
                </p>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: isDark ? '#fff' : '#111' }}>
                  {artistData?.status === 'approved' ? 'Aprobado' : 
                   artistData?.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Band Members Section */}
        {members.length > 0 && (
          <div style={{
            background: isDark ? '#1f29376c' : '#fff',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px',
            border: `1px solid ${isDark ? '#513737' : '#e5e7eb'}`
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 600,
                margin: 0,
                color: isDark ? '#fff' : '#111',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                <Users size={20} color="#dc2626" />
                Miembros de la Banda
              </h2>
              <button
                style={{
                  padding: '8px 16px',
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Edit size={14} />
                Gestionar
              </button>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '16px'
            }}>
              {members.map((member) => (
                <div key={member.id} style={{
                  background: isDark ? '#111' : '#f9fafb',
                  border: `1px solid ${isDark ? '#513737' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  padding: '20px',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = 'none'
                }}>
                  {/* Member Avatar */}
                  <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, #dc2626, #991b1b)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '16px'
                  }}>
                    <User size={24} color="#fff" />
                  </div>

                  {/* Member Info */}
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 600,
                    margin: '0 0 4px 0',
                    color: isDark ? '#fff' : '#111'
                  }}>
                    {member.name}
                  </h3>
                  
                  <p style={{
                    fontSize: '14px',
                    color: '#dc2626',
                    fontWeight: 500,
                    margin: '0 0 8px 0'
                  }}>
                    {member.role}
                  </p>
                  
                  {member.instrument && (
                    <p style={{
                      fontSize: '13px',
                      color: isDark ? '#9ca3af' : '#6b7280',
                      margin: '0 0 8px 0'
                    }}>
                      🎵 {member.instrument}
                    </p>
                  )}
                  
                  {member.bio && (
                    <p style={{
                      fontSize: '13px',
                      color: isDark ? '#e5e7eb' : '#374151',
                      margin: 0,
                      lineHeight: '1.4'
                    }}>
                      {member.bio}
                    </p>
                  )}

                  {/* Member Status */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    marginTop: '12px',
                    fontSize: '12px',
                    color: member.is_active ? '#10b981' : '#6b7280'
                  }}>
                    <div style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: member.is_active ? '#10b981' : '#6b7280'
                    }} />
                    {member.is_active ? 'Activo' : 'Inactivo'}
                  </div>
                  
                </div>
              ))}
            </div>
          </div>
        )}
        <div><EditMembers /></div>

        {/* Quick Actions */}
        <div style={{
          background: isDark ? '#1f2937' : '#fff',
          borderRadius: '12px',
          padding: '24px',
          border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
        }}>
          <h2 style={{
            fontSize: '20px',
            fontWeight: 600,
            margin: '0 0 20px 0',
            color: isDark ? '#fff' : '#111'
          }}>
            Acciones Rápidas
          </h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            <button
              style={{
                padding: '16px',
                background: isDark ? '#111' : '#f9fafb',
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDark ? '#374151' : '#f3f4f6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDark ? '#111' : '#f9fafb'
              }}
            >
              <Music size={20} color="#dc2626" />
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: isDark ? '#fff' : '#111' }}>
                  Subir Música
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                  Comparte tus canciones
                </p>
              </div>
            </button>

            <button
              style={{
                padding: '16px',
                background: isDark ? '#111' : '#f9fafb',
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDark ? '#374151' : '#f3f4f6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDark ? '#111' : '#f9fafb'
              }}
            >
              <LinkIcon size={20} color="#dc2626" />
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: isDark ? '#fff' : '#111' }}>
                  Enlaces Sociales
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                  Conecta tus redes
                </p>
              </div>
            </button>

            <button
              style={{
                padding: '16px',
                background: isDark ? '#111' : '#f9fafb',
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                textAlign: 'left',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = isDark ? '#374151' : '#f3f4f6'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = isDark ? '#111' : '#f9fafb'
              }}
            >
              <Settings size={20} color="#dc2626" />
              <div>
                <p style={{ margin: 0, fontSize: '14px', fontWeight: 500, color: isDark ? '#fff' : '#111' }}>
                  Privacidad
                </p>
                <p style={{ margin: 0, fontSize: '12px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                  Configura tu perfil
                </p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
