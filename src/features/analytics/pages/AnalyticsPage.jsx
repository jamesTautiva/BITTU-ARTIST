import { useState, useEffect } from 'react'
import { useThemeStore } from '../../../app/store'
import {
  BarChart3,
  TrendingUp,
  Users,
  PlayCircle,
  Calendar,
  Download,
  RefreshCw
} from 'lucide-react'

function AnalyticsPage() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const [timeRange, setTimeRange] = useState('30d')
  const [analytics, setAnalytics] = useState({
    plays: 0,
    listeners: 0,
    revenue: 0,
    topSongs: [],
    loading: true
  })

  const loadAnalytics = async () => {
    try {
      setAnalytics(prev => ({ ...prev, loading: true }))
      
      // Simulación de datos - en producción conectar con BITU-API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAnalytics({
        plays: 45680,
        listeners: 12450,
        revenue: 3420.75,
        topSongs: [
          { title: 'Canción de Ejemplo 1', plays: 15420 },
          { title: 'Sencillo de Verano', plays: 12450 },
          { title: 'Canción de Ejemplo 2', plays: 8930 },
          { title: 'Otra Canción', plays: 5680 },
          { title: 'Más Música', plays: 3200 }
        ],
        loading: false
      })
    } catch (error) {
      console.error('Error loading analytics:', error)
    }
  }

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const MetricCard = ({ title, value, change, icon, color }) => (
    <div style={{
      background: isDark ? '#1f2937' : '#fff',
      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
      borderRadius: '12px',
      padding: '24px',
      position: 'relative'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '16px'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: `${color}20`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {icon}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          padding: '4px 8px',
          background: change > 0 ? '#10b98120' : '#ef444420',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
          color: change > 0 ? '#10b981' : '#ef4444'
        }}>
          <TrendingUp size={12} />
          {Math.abs(change)}%
        </div>
      </div>
      
      <div style={{
        fontSize: '28px',
        fontWeight: '700',
        color: isDark ? '#fff' : '#111',
        marginBottom: '4px'
      }}>
        {value.toLocaleString()}
      </div>
      
      <div style={{
        fontSize: '14px',
        color: isDark ? '#9ca3af' : '#6b7280',
        fontWeight: '500'
      }}>
        {title}
      </div>
    </div>
  )

  return (
    <div style={{ 
      width: '100%',
      margin: '0'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '32px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <BarChart3 size={28} color="#dc2626" />
          <h1 style={{
            fontSize: '24px',
            fontWeight: 700,
            color: isDark ? '#fff' : '#111',
            margin: 0
          }}>
            Análisis
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{
              padding: '10px 16px',
              background: isDark ? '#1f2937' : '#fff',
              border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
              borderRadius: '8px',
              color: isDark ? '#fff' : '#111',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="7d">Últimos 7 días</option>
            <option value="30d">Últimos 30 días</option>
            <option value="90d">Últimos 90 días</option>
            <option value="1y">Último año</option>
          </select>

          <button
            onClick={loadAnalytics}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 16px',
              background: isDark ? '#1f2937' : '#f9fafb',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: isDark ? '#fff' : '#111',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            <RefreshCw size={16} />
            Actualizar
          </button>

          <button style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            background: '#dc2626',
            border: 'none',
            borderRadius: '8px',
            color: '#fff',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}>
            <Download size={16} />
            Exportar
          </button>
        </div>
      </div>

      {/* Metrics Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}>
        <MetricCard
          title="Reproducciones"
          value={analytics.plays}
          change={12.5}
          icon={<PlayCircle size={24} style={{ color: '#dc2626' }} />}
          color="#dc2626"
        />
        
        <MetricCard
          title="Oyentes Únicos"
          value={analytics.listeners}
          change={8.3}
          icon={<Users size={24} style={{ color: '#3b82f6' }} />}
          color="#3b82f6"
        />
        
        <MetricCard
          title="Ingresos"
          value={`$${analytics.revenue.toFixed(2)}`}
          change={15.7}
          icon={<TrendingUp size={24} style={{ color: '#10b981' }} />}
          color="#10b981"
        />
      </div>

      {/* Top Songs */}
      <div style={{
        background: isDark ? '#1f2937' : '#fff',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        borderRadius: '12px',
        padding: '24px'
      }}>
        <h2 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: isDark ? '#fff' : '#111',
          margin: '0 0 20px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <PlayCircle size={24} />
          Canciones Más Populares
        </h2>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {analytics.topSongs.map((song, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '16px',
              background: isDark ? '#111' : '#f9fafb',
              borderRadius: '8px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#dc2626',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600'
                }}>
                  {index + 1}
                </div>
                <div>
                  <div style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: isDark ? '#fff' : '#111',
                    marginBottom: '2px'
                  }}>
                    {song.title}
                  </div>
                  <div style={{
                    fontSize: '12px',
                    color: isDark ? '#9ca3af' : '#6b7280'
                  }}>
                    {song.plays.toLocaleString()} reproducciones
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnalyticsPage
