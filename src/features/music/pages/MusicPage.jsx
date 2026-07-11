import { useState, useEffect, useRef } from 'react'
import { useThemeStore, useAuthStore } from '../../../app/store'
import { Music, Plus, Play, Pause, Trash2, Search, Loader2 } from 'lucide-react'

function MusicPage() {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const isDark = theme === 'dark'

  // Estados dinámicos
  const [songs, setSongs] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [playingId, setPlayingId] = useState(null)

  // 🎵 Referencia para controlar el reproductor de audio nativo
  const audioRef = useRef(null)

  const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  const headers = { 'Authorization': `Bearer ${user?.token}` }

  // 🔄 Obtener canciones reales de la base de datos
  const fetchSongs = async () => {
    try {
      setLoading(true)
      const res = await fetch(`${API}/song/all`, { headers })
      if (!res.ok) throw new Error('No se pudieron cargar las canciones')
      const data = await res.json()
      
      // Adaptar si viene directo un array o dentro de un objeto descriptor
      setSongs(Array.isArray(data) ? data : data.songs || [])
    } catch (err) {
      console.error('Error fetching songs:', err)
      setSongs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSongs()
    
    // Cleanup: detener el audio si el usuario sale del componente
    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
      }
    }
  }, [])

  // 🎯 Control de reproducción de audio real
  const togglePlay = (song) => {
    // Si no tiene archivo de audio asignado, evitar errores
    if (!song.file_url) {
      alert('Esta canción no cuenta con un archivo de audio válido.')
      return
    }

    if (playingId === song.id) {
      // Pausar si es la misma canción
      audioRef.current.pause()
      setPlayingId(null)
    } else {
      // Si ya hay un audio sonando, lo detenemos
      if (audioRef.current) {
        audioRef.current.pause()
      }
      
      // Crear nueva instancia de audio o actualizar el origen
      audioRef.current = new Audio(song.file_url)
      audioRef.current.play().catch(err => console.error("Error al reproducir audio:", err))
      setPlayingId(song.id)

      // Evento automático: cuando la canción termine, limpia el icono de pausa
      audioRef.current.onended = () => {
        setPlayingId(null)
      }
    }
  }

  // 🗑️ Eliminar una canción directamente desde la tabla
  const handleDeleteSong = async (id, title) => {
    if (!confirm(`¿Estás seguro de que deseas eliminar "${title}"?`)) return
    try {
      const res = await fetch(`${API}/song/${id}`, {
        method: 'DELETE',
        headers
      })
      if (res.ok) {
        // Si la canción eliminada estaba sonando, pararla
        if (playingId === id && audioRef.current) {
          audioRef.current.pause()
          setPlayingId(null)
        }
        setSongs(prev => prev.filter(s => s.id !== id))
      } else {
        alert('❌ No se pudo eliminar la canción')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const filteredSongs = songs.filter(song =>
    song.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    song.album?.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    song.album_title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{ width: '100%', margin: '0' }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Music size={28} color="#dc2626" />
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: isDark ? '#fff' : '#111', margin: 0 }}>
            Mi Música
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <div style={{ position: 'relative', minWidth: '250px' }}>
            <Search size={18} style={{
              position: 'absolute', left: '12px', top: '50%',
              transform: 'translateY(-50%)', color: isDark ? '#6b7280' : '#9ca3af'
            }} />
            <input
              type="text"
              placeholder="Buscar canciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px 10px 40px',
                background: isDark ? '#1f29375b' : '#fff',
                border: `1px solid ${isDark ? '#374151' : '#d1d5db'}`,
                borderRadius: '8px', color: isDark ? '#fff' : '#111', fontSize: '14px'
              }}
            />
          </div>

          <button style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            padding: '10px 20px', background: '#dc2626', border: 'none',
            borderRadius: '8px', color: '#fff', fontSize: '14px', fontWeight: '600', cursor: 'pointer'
          }}>
            <Plus size={18} />
            Subir Canción
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '60px', color: '#dc2626', gap: '10px' }}>
          <Loader2 size={24} style={{ animation: 'spin 1s linear infinite' }} />
          <span style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>Cargando tus canciones...</span>
          <style>{`@keyframes spin { 100% { transform:rotate(360deg); } }`}</style>
        </div>
      ) : (
        /* Songs Table */
        songs.length > 0 && filteredSongs.length > 0 && (
          <div style={{
            background: isDark ? '#1f293765' : '#fff',
            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            borderRadius: '12px', overflow: 'hidden', width: '100%'
          }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
                <thead>
                  <tr style={{
                    background: isDark ? '#111' : '#f9fafb',
                    borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
                  }}>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: isDark ? '#9ca3af' : '#6b7280' }}>TÍTULO</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: isDark ? '#9ca3af' : '#6b7280' }}>ÁLBUM / SENCILLO</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: isDark ? '#9ca3af' : '#6b7280' }}>ESTADO</th>
                    <th style={{ padding: '16px', textAlign: 'left', fontSize: '14px', fontWeight: '600', color: isDark ? '#9ca3af' : '#6b7280' }}>REPRODUCCIONES</th>
                    <th style={{ padding: '16px', textAlign: 'center', fontSize: '14px', fontWeight: '600', color: isDark ? '#9ca3af' : '#6b7280' }}>ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSongs.map((song) => (
                    <tr key={song.id} style={{ borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}` }}>
                      <td style={{ padding: '16px', fontSize: '14px', color: isDark ? '#fff' : '#111', fontWeight: '500' }}>
                        {song.title}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                        {song.album?.title || song.album_title || 'Sencillo'}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>
                        <span style={{
                          padding: '4px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: '500',
                          background: song.status === 'published' ? '#10b98120' : '#f59e0b20',
                          color: song.status === 'published' ? '#10b981' : '#f59e0b'
                        }}>
                          {song.status === 'published' ? 'Publicado' : 'Borrador'}
                        </span>
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px', color: isDark ? '#9ca3af' : '#6b7280' }}>
                        {Number(song.plays || song.total_streams || 0).toLocaleString()}
                      </td>
                      <td style={{ padding: '16px', fontSize: '14px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
                          {/* 🔘 BOTÓN REPRODUCIR AUDIO REAL */}
                          <button
                            onClick={() => togglePlay(song)}
                            style={{
                              background: playingId === song.id ? '#dc2626' : isDark ? '#111' : '#f3f4f6',
                              border: 'none', borderRadius: '50%', cursor: 'pointer',
                              width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                              color: playingId === song.id ? '#fff' : isDark ? '#fff' : '#111',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }}
                          >
                            {playingId === song.id ? <Pause size={14} /> : <Play size={14} style={{ marginLeft: '2px' }} />}
                          </button>
                          
                          {/* 🗑️ BOTÓN ELIMINAR */}
                          <button 
                            onClick={() => handleDeleteSong(song.id, song.title)}
                            style={{
                              background: 'none', border: 'none', cursor: 'pointer',
                              padding: '4px', color: '#ef4444', display: 'flex', alignItems: 'center'
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      )}

      {/* Empty State */}
      {!loading && filteredSongs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: isDark ? '#9ca3af' : '#6b7280' }}>
          <Music size={48} style={{ margin: '0 auto 16px', opacity: 0.5 }} />
          <h3 style={{ fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0', color: isDark ? '#fff' : '#111' }}>
            No se encontraron canciones
          </h3>
          <p style={{ margin: 0 }}>
            {searchTerm ? 'Intenta con otra búsqueda o limpia el filtro.' : 'Sube tu primera canción para comenzar.'}
          </p>
        </div>
      )}
    </div>
  )
}

export default MusicPage