import { useState, useEffect } from 'react'
import { useThemeStore } from '../../app/store'
import {
  Music,
  Users,
  PlayCircle,
  TrendingUp,
  DollarSign,
  Clock,
  RefreshCw
} from 'lucide-react'

function DashboardPage() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  const [stats, setStats] = useState({
    totalSongs: 0,
    totalPlays: 0,
    monthlyListeners: 0,
    revenue: 0,
    loading: true,
    lastUpdated: null
  })

  const [refreshing, setRefreshing] = useState(false)

  const loadDashboardStats = async () => {
    try {
      setRefreshing(true)
      
      // Simulación de datos - en producción conectar con BITU-API
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setStats({
        totalSongs: 24,
        totalPlays: 15420,
        monthlyListeners: 3420,
        revenue: 2840.50,
        loading: false,
        lastUpdated: new Date()
      })
    } catch (error) {
      console.error('Error loading dashboard stats:', error)
    } finally {
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const StatCard = ({ title, value, subtitle, icon, color, loading = false }) => (
    <div style={{
      background: isDark ? '#1f293769' : '#fff',
      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
      borderRadius: '12px',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '0',
        right: '0',
        width: '100px',
        height: '100px',
        background: `${color}10`,
        borderRadius: '50%',
        transform: 'translate(30px, -30px)'
      }} />
      
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px'
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
          {loading && (
            <RefreshCw size={16} className="animate-spin" style={{ color: isDark ? '#9ca3af' : '#6b7280' }} />
          )}
        </div>
        
        <div style={{
          fontSize: '32px',
          fontWeight: '700',
          color: isDark ? '#fff' : '#111',
          marginBottom: '4px'
        }}>
          {loading ? '...' : value.toLocaleString()}
        </div>
        
        <div style={{
          fontSize: '14px',
          color: isDark ? '#9ca3af' : '#6b7280',
          fontWeight: '500'
        }}>
          {title}
        </div>
        
        {subtitle && (
          <div style={{
            fontSize: '12px',
            color: isDark ? '#6b7280' : '#9ca3af',
            marginTop: '4px'
          }}>
            {subtitle}
          </div>
        )}
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
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px'
      }}>
        <div>
          <h1 style={{
            fontSize: '32px',
            fontWeight: '700',
            color: isDark ? '#fff' : '#111',
            margin: '0 0 8px 0'
          }}>
            Dashboard
          </h1>
          <p style={{
            fontSize: '16px',
            color: isDark ? '#9ca3af' : '#6b7280',
            margin: 0
          }}>
            Resumen de tu actividad musical
          </p>
        </div>
        
        <button
          onClick={loadDashboardStats}
          disabled={refreshing}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 20px',
            background: isDark ? '#1f29370b' : '#f9fafb',
            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            borderRadius: '8px',
            color: isDark ? '#fff' : '#111',
            cursor: refreshing ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            fontWeight: '500'
          }}
        >
          <RefreshCw size={16} className={refreshing ? 'animate-spin' : ''} />
          {refreshing ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>

      {/* Last Updated */}
      {stats.lastUpdated && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '24px',
          fontSize: '14px',
          color: isDark ? '#9ca3af' : '#6b7280'
        }}>
          <Clock size={16} />
          Última actualización: {stats.lastUpdated.toLocaleString()}
        </div>
      )}

      {/* Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: window.innerWidth < 768 
          ? '1fr' 
          : window.innerWidth < 1024 
            ? 'repeat(2, 1fr)'
            : 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '32px',
        width: '100%'
      }}>
        <StatCard
          title="Total Canciones"
          value={stats.totalSongs}
          icon={<Music size={24} style={{ color: '#dc2626' }} />}
          color="#dc2626"
          loading={stats.loading}
        />
        
        <StatCard
          title="Reproducciones"
          value={stats.totalPlays}
          subtitle="Este mes"
          icon={<PlayCircle size={24} style={{ color: '#10b981' }} />}
          color="#10b981"
          loading={stats.loading}
        />
        
        <StatCard
          title="Oyentes Mensuales"
          value={stats.monthlyListeners}
          subtitle="Únicos"
          icon={<Users size={24} style={{ color: '#3b82f6' }} />}
          color="#3b82f6"
          loading={stats.loading}
        />
        
        <StatCard
          title="Ingresos"
          value={`$${stats.revenue.toFixed(2)}`}
          subtitle="Este mes"
          icon={<DollarSign size={24} style={{ color: '#8b5cf6' }} />}
          color="#8b5cf6"
          loading={stats.loading}
        />
      </div>

      {/* Recent Activity */}
      <div style={{
        background: isDark ? '#1f293768' : '#fff',
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
          <TrendingUp size={24} />
          Actividad Reciente
        </h2>
        
        <div style={{
          fontSize: '14px',
          color: isDark ? '#9ca3af' : '#6b7280',
          textAlign: 'center',
          padding: '40px'
        }}>
          Tu actividad reciente aparecerá aquí
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
