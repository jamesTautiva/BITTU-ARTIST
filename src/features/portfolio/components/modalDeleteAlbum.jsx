import React, { useState } from 'react'
import { useThemeStore, useAuthStore } from '../../../app/store'
import axios from 'axios' // ✅ import axios

export const DeleteAlbumModal = ({ albumId, albumTitle, onClose, onDeleted }) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const isDark = theme === 'dark'
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    try {
      setLoading(true)
      await axios.delete(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/album/delete/${albumId}`,
        { headers: { 'Authorization': `Bearer ${user?.token}` } }
      )
      onDeleted(albumId)
      onClose()
    } catch (err) {
      console.error('Error deleting album:', err)
      alert('❌ Error al eliminar el álbum')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: isDark ? '#1f2937' : '#fff',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
        borderRadius: '12px',
        padding: '32px',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h2 style={{ color: isDark ? '#fff' : '#111', fontSize: '20px', fontWeight: 700, marginBottom: '12px' }}>
          ¿Eliminar álbum?
        </h2>
        <p style={{ color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '24px' }}>
          Vas a eliminar <strong style={{ color: '#dc2626' }}>{albumTitle}</strong>. Esta acción no se puede deshacer.
        </p>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button
            onClick={onClose}
            disabled={loading}
            style={{
              padding: '10px 20px', background: 'transparent',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px', color: isDark ? '#9ca3af' : '#6b7280',
              cursor: 'pointer', fontWeight: 600
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              padding: '10px 20px', background: '#dc2626',
              border: 'none', borderRadius: '8px', color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 600, opacity: loading ? 0.7 : 1
            }}
          >
            {loading ? 'Eliminando...' : 'Eliminar'}
          </button>
        </div>
      </div>
    </div>
  )
}