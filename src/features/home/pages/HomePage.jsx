import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '../../../app/store'
import { Music, Users, PlayCircle, TrendingUp, ArrowRight, Star, Headphones } from 'lucide-react'

function HomePage() {
  const { theme } = useThemeStore()
  const navigate = useNavigate()
  const isDark = theme === 'dark'
  const iconBittu = '../../../../public/icon-bittu.svg'

  const [email, setEmail] = useState('')

  const features = [
    {
      icon: <Music size={48} color="#dc2626" />,
      title: 'Gestiona tu Música',
      description: 'Sube, organiza y distribuye tus canciones y álbumes'
    },
    {
      icon: <Users size={48} color="#3b82f6" />,
      title: 'Conecta con Fans',
      description: 'Construye tu comunidad y comparte tu talento con el mundo'
    },
    {
      icon: <PlayCircle size={48} color="#10b981" />,
      title: 'Analiza tu Rendimiento',
      description: 'Estadísticas detalladas sobre reproducciones y crecimiento'
    },
    {
      icon: <TrendingUp size={48} color="#8b5cf6" />,
      title: 'Monetiza tu Arte',
      description: 'Gana ingresos con tu música y controla tus finanzas'
    }
  ]

  const stats = [
    { label: 'Artistas Activos', value: '10,000+' },
    { label: 'Canciones Publicadas', value: '50,000+' },
    { label: 'Reproducciones Mensuales', value: '1M+' },
    { label: 'Países Alcance', value: '120+' }
  ]

  return (
    <div style={{
      minHeight: '100vh',
      background: isDark ? '#11111185' : '#f3f4f6',
      color: isDark ? '#fff' : '#111'
    }}>
      {/* Hero Section */}
      <div style={{
        padding: '80px 24px',
        textAlign: 'center',
        background: `linear-gradient(135deg, ${isDark ? '#1f2937' : '#dc2626'}, ${isDark ? '#111' : '#991b1b'})`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.1)',
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.3) 0%, transparent 50%)`
        }} />
        
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px', justifyContent: 'center', flexDirection: 'column' }}>
            <h1 style={{
              fontSize: window.innerWidth < 768 ? '32px' : '48px',
              fontWeight: 800,
              margin: 0,
              color: '#fff',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
              fontFamily: 'Cinzel Decorative, serif'
            }}>
              BITTU ARTIST
            </h1>
            <img src={iconBittu} alt="Bitu Artist" />
          </div>
          
          <p style={{
            fontSize: window.innerWidth < 768 ? '18px' : '20px',
            margin: '0 0 32px 0',
            color: '#fff',
            maxWidth: '600px',
            lineHeight: 1.6
          }}>
            La plataforma definitiva para artistas musicales. 
            Gestiona tu música, conecta con tus fans y haz crecer tu carrera.
          </p>

          {/* CTA Buttons */}
          <div style={{
            display: 'flex',
            gap: '16px',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                padding: '16px 32px',
                color: '#dc2626',
                backgroundColor: 'transparent',
                border: '2px solid #dc2626',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              Crea tu cuenta gratis
              <ArrowRight size={20} />
            </button>
            
            <button
              onClick={() => navigate('/login')}
              style={{
                padding: '16px 32px',
                background: 'transparent',
                color: '#fff',
                border: '2px solid #fff',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              Iniciar Sesión
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div style={{
        padding: '80px 24px',
        background: isDark ? '#111' : '#fff'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 700,
            margin: '0 0 16px 0',
            color: isDark ? '#fff' : '#111'
          }}>
            Todo lo que necesitas como artista
          </h2>
          <p style={{
            fontSize: '18px',
            color: isDark ? '#9ca3af' : '#6b7280',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Herramientas profesionales diseñadas para ayudarte a crear, distribuir y monetizar tu música
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(2, 1fr)',
          gap: '32px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          {features.map((feature, index) => (
            <div key={index} style={{
              textAlign: 'center',
              padding: '32px',
              background: isDark ? '#1f293766' : '#f9fafb',
              borderRadius: '16px',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ marginBottom: '16px' }}>
                {feature.icon}
              </div>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 600,
                margin: '0 0 8px 0',
                color: isDark ? '#fff' : '#111'
              }}>
                {feature.title}
              </h3>
              <p style={{
                fontSize: '16px',
                color: isDark ? '#9ca3af' : '#6b7280',
                margin: 0,
                lineHeight: 1.5
              }}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div style={{
        padding: '80px 24px',
        background: isDark ? '#1f2937' : '#f9fafb'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 style={{
            fontSize: '36px',
            fontWeight: 700,
            margin: '0 0 16px 0',
            color: isDark ? '#fff' : '#111'
          }}>
            Únete a una comunidad en crecimiento
          </h2>
          <p style={{
            fontSize: '18px',
            color: isDark ? '#9ca3af' : '#6b7280',
            maxWidth: '800px',
            margin: '0 auto',
            lineHeight: 1.6
          }}>
            Miles de artistas ya confían en BITU ARTIST para hacer crecer su carrera musical
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(4, 1fr)',
          gap: '24px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{
              textAlign: 'center',
              padding: '24px',
              background: isDark ? '#111' : '#fff',
              borderRadius: '12px',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
            }}>
              <div style={{
                fontSize: '32px',
                fontWeight: 700,
                color: '#dc2626',
                marginBottom: '8px'
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: '14px',
                color: isDark ? '#9ca3af' : '#6b7280',
                fontWeight: 500
              }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div style={{
        padding: '80px 24px',
        background: isDark ? '#111' : '#fff',
        textAlign: 'center'
      }}>
        <div style={{
          maxWidth: '600px',
          margin: '0 auto'
        }}>
          <h2 style={{
            fontSize: '28px',
            fontWeight: 700,
            margin: '0 0 24px 0',
            color: isDark ? '#fff' : '#111'
          }}>
            ¿Listo para empezar?
          </h2>
          <p style={{
            fontSize: '18px',
            color: isDark ? '#9ca3af' : '#6b7280',
            marginBottom: '32px',
            lineHeight: 1.6
          }}>
            Únete a miles de artistas que ya están haciendo crecer su música con BITU ARTIST
          </p>
          
          <form onSubmit={(e) => {
            e.preventDefault()
            navigate('/register')
          }}>
            <div style={{
              display: 'flex',
              gap: '16px',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <input
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  flex: 1,
                  padding: '16px',
                  background: isDark ? '#1f2937' : '#f9fafb',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '12px',
                  color: isDark ? '#fff' : '#111',
                  fontSize: '16px',
                  maxWidth: '300px'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '16px 32px',
                  background: '#dc2626',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                Comenzar Ahora
                <ArrowRight size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default HomePage
