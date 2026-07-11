import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'
import { useThemeStore } from '../../app/store'
import { useAppStore } from '../../app/store'
import {
  LayoutDashboard,
  Briefcase,
  Music,
  BarChart3,
  User,
  Settings,
  Menu,
  X
} from 'lucide-react'

function Sidebar() {
  const { theme } = useThemeStore()
  const { sidebarOpen, toggleSidebar } = useAppStore()
  const isDark = theme === 'dark'

  const menuItems = [
    { path: '/app', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/app/portfolio', icon: Briefcase, label: 'Portafolio' },
    { path: '/app/music', icon: Music, label: 'Música' },
    { path: '/app/analytics', icon: BarChart3, label: 'Análisis' },
    { path: '/app/profile', icon: User, label: 'Perfil' },
    { path: '/app/settings', icon: Settings, label: 'Configuración' },
  ]

  const [isMobile, setIsMobile] = useState(window.innerWidth < 768)

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768
      setIsMobile(mobile)
      if (!mobile && sidebarOpen) {
        toggleSidebar()
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [sidebarOpen, toggleSidebar])

  return (
    <>
      {/* Mobile menu button */}
      {isMobile && !sidebarOpen && (
        <button
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: '80px',
            left: '16px',
            zIndex: 1000,
            background: isDark ? '#1f293766' : '#fff',
            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            borderRadius: '8px',
            padding: '8px',
            cursor: 'pointer'
          }}
        >
          <Menu size={20} color={isDark ? '#fff' : '#111'} />
        </button>
      )}

      {/* Overlay for mobile */}
      {isMobile && sidebarOpen && (
        <div
          onClick={toggleSidebar}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(105, 84, 84, 0.5)',
            zIndex: 999
          }}
        />
      )}

      {/* Sidebar */}
      <div style={{
        width: isMobile ? (sidebarOpen ? '250px' : '0') : '250px',
        height: 'calc(100vh - 60px)',
        marginTop: '60px',
        background: isDark ? '#00000077' : '#fff',
        borderRight: `1px solid ${isDark ? '#470707' : '#e5e7eb'}`,
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        position: 'fixed',
        top: '0',
        left: '0',
        zIndex: 100
      }}>
        {/* Close button for mobile */}
        {isMobile && (
          <button
            onClick={toggleSidebar}
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              zIndex: 1001
            }}
          >
            <X size={20} color={isDark ? '#fff' : '#111'} />
          </button>
        )}

        <nav style={{ 
          padding: '24px 16px',
          height: '100%',
          overflow: 'auto'
        }}>
          <img src="../../../../public/icon-bittu.svg" alt="Bitu" style={{ width: '200px', height: 'auto', marginBottom: '16px' }} />
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {menuItems.map((item) => (
              <li key={item.path} style={{ marginBottom: '8px' }}>
                <NavLink
                  to={item.path}
                  style={({ isActive }) => ({
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    color: isActive 
                      ? '#fff' 
                      : isDark 
                        ? '#d1d5db' 
                        : '#4b5563',
                    background: isActive 
                      ? '#dc2626' 
                      : isDark 
                        ? 'rgba(255,255,255,0.05)' 
                        : 'rgba(0,0,0,0.03)',
                    transition: 'all 0.2s ease',
                    width: '100%',
                    boxSizing: 'border-box',
                    border: isActive 
                      ? '1px solid transparent' 
                      : `1px solid ${isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`
                  })}
                  onClick={() => {
                    if (isMobile) {
                      toggleSidebar()
                    }
                  }}
                >
                  <item.icon size={20} />
                  <span style={{ fontSize: '14px', fontWeight: '500' }}>
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  )
}

export default Sidebar
