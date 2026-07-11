import { useThemeStore } from '../../app/store'
import { useAuthStore } from '../../app/store'
import { Moon, Sun, LogOut, User, Music } from 'lucide-react'

function Navbar() {
  const { theme, toggleTheme } = useThemeStore()
  const { user, logout } = useAuthStore()
  const isDark = theme === 'dark'
  const iconBitu = '../../../../public/icon-bittu.svg'

  return (
    <nav style={{
      background: isDark ? '#000000' : '#fff',
      borderBottom: `1px solid ${isDark ? '#513737' : '#e5e7eb'}`,
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '60px',
      width: '100%',
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <h1 style={{
          fontSize: window.innerWidth < 768 ? '16px' : '20px',
          fontWeight: 700,
          color: isDark ? '#fff' : '#111',
          margin: 0,
          fontFamily: 'cinzel decorative, sans-serif'
        }}>
          BITU ARTIST
        </h1>
      </div>

      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: window.innerWidth < 768 ? '8px' : '16px'
      }}>
        <button
          onClick={toggleTheme}
          style={{
            background: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)'}`,
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '8px',
            color: isDark ? '#fff' : '#111',
            transition: 'all 0.2s ease'
          }}
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {window.innerWidth >= 768 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <User size={20} />
            <span style={{ fontSize: '14px' }}>
              {user?.username || 'Artista'}
            </span>
          </div>
        )}

        <button
          onClick={logout}
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            cursor: 'pointer',
            padding: '8px 12px',
            borderRadius: '8px',
            color: '#ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: window.innerWidth >= 768 ? '6px' : '0',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'all 0.2s ease'
          }}
        >
          <LogOut size={18} />
        </button>
      </div>
    </nav>
  )
}

export default Navbar
