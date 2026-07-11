import { useState, useEffect } from 'react'
import { useThemeStore, useAuthStore } from '../../../app/store'
import { Briefcase, Plus, Upload, Edit, Trash2, X } from 'lucide-react'
import axios from 'axios'
import { DeleteAlbumModal } from '../components/modalDeleteAlbum'
import CreateAlbumPage from './CreateAlbumPage'
// ✅ CORREGIDO: Importación con llaves { } para hacer match con el export const del componente
import { EditAlbumModal } from '../components/modalEditAlbum'

function PortfolioPage() {
  const { theme } = useThemeStore()
  const isDark = theme === 'dark'
  const { user } = useAuthStore()

  const [portfolio, setPortfolio] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteModal, setDeleteModal] = useState({ open: false, albumId: null, albumTitle: '' })
  const [createModal, setCreateModal] = useState(false)
  const [editModal, setEditModal] = useState({ open: false, album: null })
  const idArtist = user?.artist?.id

  // Función para obtener los álbumes
  const fetchPortfolio = async () => {
    if (!idArtist) return
    try {
      setLoading(true)
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api'}/album/artist/${idArtist}`,
        { headers: { 'Authorization': `Bearer ${user?.token}` } }
      )
      setPortfolio(Array.isArray(response.data) ? response.data : response.data?.albums || [])
    } catch (err) {
      console.error('Error fetching portfolio:', err)
      setPortfolio([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPortfolio()
  }, [idArtist])

  return (
    <div style={{ width: '100%', margin: '0' }}>

      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Briefcase size={28} color="#dc2626" />
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: isDark ? '#fff' : '#111', margin: 0 }}>
            Mi Portafolio
          </h1>
        </div>

        <button
          onClick={() => setCreateModal(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '12px 20px', background: 'transparent',
            border: '1px solid #dc2626', borderRadius: '8px',
            color: '#dc2626', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
          }}
        >
          <Plus size={18} />
          Nueva Obra
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: isDark ? '#9ca3af' : '#6b7280' }}>
          Cargando portafolio...
        </div>
      )}

      {/* Grid */}
      {!loading && portfolio.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '20px', width: '100%'
        }}>
          {portfolio.map((item) => {
            if (!item) return null

            return (
              <div key={item?.id || Math.random()} style={{
                background: isDark ? '#1f293743' : '#fff',
                border: `1px solid ${isDark ? '#d84343' : '#e5e7eb'}`,
                borderRadius: '12px', overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                width: '280px'
              }}>

                {/* Cover Image Container */}
                <div style={{
                  width: '100%',
                  aspectRatio: '1',
                  background: item?.cover_image ? 'transparent' : '#dc2626',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {item?.cover_image ? (
                    <img 
                      src={item.cover_image} 
                      alt={item?.title || 'Cover'} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{
                      width: '100%', height: '100%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Upload size={48} color="#fff" />
                    </div>
                  )}

                  {/* Botones de acción sobre la imagen */}
                  <div style={{ 
                    position: 'absolute', top: '12px', right: '12px', 
                    display: 'flex', gap: '8px',
                    background: 'rgba(0,0,0,0.6)',
                    padding: '6px',
                    borderRadius: '8px'
                  }}>
                    <button 
                      onClick={() => setEditModal({ open: true, album: item })}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#fff' }}>
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => setDeleteModal({ open: true, albumId: item.id, albumTitle: item.title || 'Sin título' })}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#ef4444' }}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '16px' }}>
                  <h3 style={{ 
                    fontSize: '16px', fontWeight: '600', 
                    color: isDark ? '#fff' : '#111', 
                    margin: '0 0 12px 0',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}>
                    {item?.title || 'Obra sin título'}
                  </h3>

                  <div style={{ fontSize: '13px', color: isDark ? '#9ca3af' : '#6b7280', marginBottom: '12px' }}>
                    <div style={{ marginBottom: '4px' }}>Tipo: {item?.album_type === 'single' ? 'Sencillo' : 'Álbum'}</div>
                    <div style={{ marginBottom: '4px' }}>Lanzamiento: {item?.release_date ? new Date(item.release_date).toLocaleDateString('es-CO') : 'Sin fecha'}</div>
                    <div style={{ marginBottom: '4px' }}>Reproducciones: {Number(item?.total_streams || item?.plays || 0).toLocaleString('es-CO')}</div>
                    <div>Canciones: {item?.total_tracks || 0}</div>
                  </div>

                  <div style={{
                    display: 'inline-block', padding: '4px 10px',
                    background: item?.status === 'published' ? '#10b98120' : '#f59e0b20',
                    color: item?.status === 'published' ? '#10b981' : '#f59e0b',
                    borderRadius: '6px', fontSize: '12px', fontWeight: '500'
                  }}>
                    {item?.status === 'published' ? 'Publicado' : 'Borrador'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading && portfolio.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: isDark ? '#9ca3af' : '#6b7280' }}>
          <Upload size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0', color: isDark ? '#fff' : '#111' }}>
            No hay obras en tu portafolio
          </h3>
          <p style={{ margin: 0 }}>Comienza subiendo tu primera canción o álbum</p>
        </div>
      )}

      {/* Modal Crear Album */}
      {createModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px'
        }}>
          <div style={{
            background: isDark ? '#111827' : '#f9fafb',
            borderRadius: '16px', width: '100%', maxWidth: '700px',
            maxHeight: '90vh', overflowY: 'auto', position: 'relative'
          }}>
            <button
              onClick={() => setCreateModal(false)}
              style={{
                position: 'absolute', top: '16px', right: '16px',
                background: 'none', border: 'none', cursor: 'pointer',
                color: isDark ? '#9ca3af' : '#6b7280', zIndex: 10
              }}
            >
              <X size={24} />
            </button>

            <CreateAlbumPage
              onSuccess={() => {
                fetchPortfolio()
                setCreateModal(false)
              }}
              onCancel={() => setCreateModal(false)}
            />
          </div>
        </div>
      )}

      {/* ✅ Modal Editar Album Integrado Correctamente */}
      {editModal.open && editModal.album && (
        <EditAlbumModal
          albumId={editModal.album.id}
          onClose={() => setEditModal({ open: false, album: null })}
          onUpdated={() => {
            fetchPortfolio() // Recarga los datos modificados del backend
            setEditModal({ open: false, album: null })
          }}
        />
      )}

      {/* Modal Eliminar */}
      {deleteModal.open && (
        <DeleteAlbumModal
          albumId={deleteModal.albumId}
          albumTitle={deleteModal.albumTitle}
          onClose={() => setDeleteModal({ open: false, albumId: null, albumTitle: '' })}
          onDeleted={(id) => setPortfolio(prev => prev.filter(a => a.id !== id))}
        />
      )}

    </div>
  )
}

export default PortfolioPage