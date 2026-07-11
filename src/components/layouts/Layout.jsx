import { Outlet } from 'react-router-dom'
import { useThemeStore } from '../../app/store'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

function Layout() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: isDark ? '#111' : '#f3f4f6', 
      color: isDark ? '#fff' : '#111'
    }}>
      <Navbar />
      <div style={{ 
        display: 'flex'
      }}>
        <Sidebar />
        <main style={{ 
          position: 'fixed',
          top: '60px',
          left: '250px',
          right: '0',
          bottom: '0',
          flex: 1, 
          padding: '24px',
          overflow: 'auto'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Layout
