import { useState, useEffect } from 'react'
import { useThemeStore, useAuthStore } from '../../../app/store'
import { Music, Upload, Save, Disc, X, ChevronRight, Edit3, Trash2, ArrowLeft, AlertTriangle } from 'lucide-react'

export const EditAlbumModal = ({ albumId, onClose, onUpdated }) => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const isDark = theme === 'dark'

  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)

  // Estados del Álbum
  const [albumData, setAlbumData] = useState({
    title: '',
    release_date: '',
    album_type: 'album',
    cover_image: null, 
    current_cover_url: '' 
  })

  // Estados de Canciones vinculadas
  const [songsList, setSongsList] = useState([])
  
  // Estados para la edición de canción
  const [editingSong, setEditingSong] = useState(null) 
  const [isSavingSong, setIsSavingSong] = useState(false)

  // 🗑️ NUEVO ESTADO: Para el modal de confirmación de borrado de canción
  const [deleteSongModal, setDeleteSongModal] = useState({ open: false, songId: null, songTitle: '' })
  const [isDeletingSong, setIsDeletingSong] = useState(false)

  const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  const headers = { 'Authorization': `Bearer ${user?.token}` }
  const jsonHeaders = { ...headers, 'Content-Type': 'application/json' }

  // Cargar todos los datos del álbum al abrir el modal o refrescar
  const loadAlbumDetails = async () => {
    try {
      setLoading(true)
      const albumRes = await fetch(`${API}/album/${albumId}`, { headers })
      if (!albumRes.ok) throw new Error('No se pudo obtener el álbum')
      const album = await albumRes.json()

      setAlbumData({
        title: album.title || '',
        release_date: album.release_date ? album.release_date.split('T')[0] : '',
        album_type: album.album_type || 'album',
        cover_image: null,
        current_cover_url: album.cover_image || ''
      })

      if (album.songs) {
        setSongsList(album.songs)
      } else {
        const songsRes = await fetch(`${API}/song/album/${albumId}`, { headers })
        if (songsRes.ok) {
          const songsData = await songsRes.json()
          setSongsList(Array.isArray(songsData) ? songsData : [])
        }
      }
    } catch (err) {
      console.error('Error cargando detalles del álbum:', err)
      alert('❌ Error al cargar los datos del álbum')
      onClose()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (albumId) loadAlbumDetails()
  }, [albumId])

  // Guardar cambios del Step 1 (Info Básica)
  const handleUpdateInfo = async () => {
    if (!albumData.title) { alert('El título es requerido'); return }
    setIsSaving(true)
    try {
      const res = await fetch(`${API}/album/update/${albumId}`, {
        method: 'PUT',
        headers: jsonHeaders,
        body: JSON.stringify({
          title: albumData.title,
          release_date: albumData.release_date,
          album_type: albumData.album_type,
        })
      })
      if (res.ok) {
        setCurrentStep(2)
      } else {
        alert('❌ Error al actualizar la información')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSaving(false)
    }
  }

  // Guardar cambios del Step 2 (Subir nueva Portada si aplica)
  const handleUpdateCover = async () => {
    if (!albumData.cover_image) { setCurrentStep(3); return } 
    setIsUploadingCover(true)
    try {
      const fd = new FormData()
      fd.append('cover_image', albumData.cover_image)
      const res = await fetch(`${API}/upload/album-cover/${albumId}`, { 
        method: 'PUT', 
        headers, 
        body: fd 
      })
      if (res.ok) {
        const updatedAlbum = await res.json()
        setAlbumData(prev => ({ ...prev, current_cover_url: updatedAlbum.cover_image, cover_image: null }))
        setCurrentStep(3)
      } else {
        alert('❌ Error al subir la nueva portada')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsUploadingCover(false)
    }
  }

  // Guarda los cambios de una canción (PUT /song/:id)
  const handleUpdateSongDetails = async () => {
    if (!editingSong.title.trim()) { alert('El título de la canción es requerido'); return }
    setIsSavingSong(true)
    try {
      const res = await fetch(`${API}/song/update/${editingSong.id}`, {
        method: 'PUT',
        headers: jsonHeaders,
        body: JSON.stringify({
          title: editingSong.title,
          lyrics: editingSong.lyrics || null,
          language: editingSong.language,
          license_type: editingSong.license_type,
          is_creative_commons: !!editingSong.is_creative_commons,
          copyright: editingSong.copyright || null,
          isrc: editingSong.isrc?.trim() === "" ? null : editingSong.isrc?.trim(),
          upc: editingSong.upc?.trim() === "" ? null : editingSong.upc?.trim()
        })
      })

      if (res.ok) {
        setEditingSong(null)
        loadAlbumDetails() 
      } else {
        alert('❌ Error al actualizar la canción')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsSavingSong(false)
    }
  }

  // 🗑️ NUEVA FUNCIÓN: Ejecuta el borrado físico/lógico de la canción (DELETE /song/:id)
  const handleDeleteSong = async () => {
    setIsDeletingSong(true)
    try {
      const res = await fetch(`${API}/song/delete/${deleteSongModal.songId}`, {
        method: 'DELETE',
        headers
      })

      if (res.ok) {
        // Remueve localmente del estado para respuesta instantánea
        setSongsList(prev => prev.filter(s => s.id !== deleteSongModal.songId))
        setDeleteSongModal({ open: false, songId: null, songTitle: '' })
      } else {
        alert('❌ Error al intentar eliminar la canción')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setIsDeletingSong(false)
    }
  }

  // Estilos del ecosistema visual
  const inputStyle = {
    width: '100%', padding: '12px',
    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
    borderRadius: '8px', background: isDark ? '#111' : '#fff',
    color: isDark ? '#fff' : '#111', fontSize: '14px', boxSizing: 'border-box'
  }

  const labelStyle = {
    display: 'block', fontSize: '14px', fontWeight: '500', 
    color: isDark ? '#fff' : '#111', marginBottom: '8px'
  }

  const btnPrimary = {
    padding: '12px 24px', border: 'none', borderRadius: '8px',
    background: '#dc2626', color: '#fff', fontSize: '14px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600'
  }

  const btnSecondary = {
    padding: '12px 24px', borderRadius: '8px', background: 'transparent',
    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
    color: isDark ? '#9ca3af' : '#6b7280', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
  }

  const btnDanger = {
    padding: '12px 24px', border: 'none', borderRadius: '8px',
    background: '#ef4444', color: '#fff', fontSize: '14px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: '600'
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1050, padding: '20px'
    }}>
      <div style={{
        background: isDark ? '#111827' : '#f9fafb', borderRadius: '16px',
        width: '100%', maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto',
        position: 'relative', padding: '24px', border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
      }}>
        
        <button onClick={onClose} style={{
          position: 'absolute', top: '16px', right: '16px', background: 'none',
          border: 'none', cursor: 'pointer', color: isDark ? '#9ca3af' : '#6b7280'
        }}>
          <X size={24} />
        </button>

        <h1 style={{ fontSize: '22px', fontWeight: '700', color: isDark ? '#fff' : '#111', marginBottom: '20px' }}>
          Editar Obra
        </h1>

        {/* Progress Bar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
          {['1. Info', '2. Portada', '3. Canciones'].map((label, idx) => (
            <button
              key={label}
              disabled={!!editingSong} 
              onClick={() => !loading && setCurrentStep(idx + 1)}
              style={{
                flex: 1, padding: '8px', borderRadius: '6px', fontSize: '12px', fontWeight: '600',
                border: 'none', cursor: editingSong ? 'not-allowed' : 'pointer', opacity: editingSong ? 0.5 : 1,
                background: currentStep === idx + 1 ? '#dc2626' : isDark ? '#1f2937' : '#e5e7eb',
                color: currentStep === idx + 1 ? '#fff' : isDark ? '#9ca3af' : '#6b7280'
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: isDark ? '#9ca3af' : '#6b7280' }}>
            Cargando datos de la obra...
          </div>
        ) : (
          <div>
            {/* STEP 1: INFO BÁSICA */}
            {currentStep === 1 && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: isDark ? '#fff' : '#111', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Disc size={20} color="#dc2626" /> Información General
                </h3>
                <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr', marginBottom: '24px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={labelStyle}>Título del Álbum *</label>
                    <input type="text" value={albumData.title} onChange={e => setAlbumData({ ...albumData, title: e.target.value })} style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Tipo de Obra</label>
                    <select value={albumData.album_type} onChange={e => setAlbumData({ ...albumData, album_type: e.target.value })} style={inputStyle}>
                      <option value="album">Álbum</option>
                      <option value="single">Sencillo</option>
                      <option value="ep">EP</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Fecha de Lanzamiento</label>
                    <input type="date" value={albumData.release_date} onChange={e => setAlbumData({ ...albumData, release_date: e.target.value })} style={inputStyle} />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button onClick={onClose} style={btnSecondary}>Cancelar</button>
                  <button onClick={handleUpdateInfo} style={btnPrimary}>
                    {isSaving ? 'Guardando...' : <>{'Siguiente'} <ChevronRight size={16} /></>}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: PORTADA */}
            {currentStep === 2 && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: '600', color: isDark ? '#fff' : '#111', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Upload size={20} color="#dc2626" /> Cambiar Portada
                </h3>
                <div style={{ border: `2px dashed ${isDark ? '#374151' : '#e5e7eb'}`, borderRadius: '12px', padding: '30px', textAlign: 'center', marginBottom: '24px' }}>
                  <input type="file" accept="image/*" id="edit-cover-upload" style={{ display: 'none' }}
                    onChange={e => { if (e.target.files[0]) setAlbumData({ ...albumData, cover_image: e.target.files[0] }) }} />
                  
                  {albumData.cover_image ? (
                    <img src={URL.createObjectURL(albumData.cover_image)} alt="Nueva Portada" style={{ maxWidth: '180px', maxHeight: '180px', borderRadius: '8px', objectFit: 'cover', marginBottom: '16px' }} />
                  ) : albumData.current_cover_url ? (
                    <img src={albumData.current_cover_url} alt="Portada Actual" style={{ maxWidth: '180px', maxHeight: '180px', borderRadius: '8px', objectFit: 'cover', marginBottom: '16px' }} />
                  ) : (
                    <Upload size={40} style={{ color: '#6b7280', marginBottom: '16px' }} />
                  )}
                  <br />
                  <label htmlFor="edit-cover-upload" style={{ ...btnSecondary, display: 'inline-flex', cursor: 'pointer', padding: '8px 16px' }}>
                    Seleccionar Nueva Imagen
                  </label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <button onClick={() => setCurrentStep(1)} style={btnSecondary}>Anterior</button>
                  <button onClick={handleUpdateCover} style={btnPrimary}>
                    {isUploadingCover ? 'Subiendo...' : <><Upload size={16} /> Guardar y Continuar</>}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3: CANCIONES VINCULADAS */}
            {currentStep === 3 && (
              <div>
                {/* VISTA A: SUB-FORMULARIO DINÁMICO DE EDICIÓN DE CANCIÓN */}
                {editingSong ? (
                  <div>
                    <button onClick={() => setEditingSong(null)} style={{ ...btnSecondary, padding: '6px 12px', marginBottom: '16px', fontSize: '13px' }}>
                      <ArrowLeft size={14} /> Volver al listado
                    </button>
                    <h4 style={{ fontSize: '15px', fontWeight: '600', color: isDark ? '#fff' : '#111', marginBottom: '16px' }}>
                      Editando: <span style={{ color: '#dc2626' }}>{editingSong.title}</span>
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                      <div>
                        <label style={labelStyle}>Título de la Canción *</label>
                        <input type="text" value={editingSong.title} onChange={e => setEditingSong({...editingSong, title: e.target.value})} style={inputStyle} />
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={labelStyle}>Idioma</label>
                          <select value={editingSong.language || 'spa'} onChange={e => setEditingSong({...editingSong, language: e.target.value})} style={inputStyle}>
                            <option value="spa">Español (SPA)</option>
                            <option value="eng">Inglés (ENG)</option>
                            <option value="por">Portugués (POR)</option>
                          </select>
                        </div>
                        <div>
                          <label style={labelStyle}>Tipo de Licencia</label>
                          <select value={editingSong.license_type || 'all_rights_reserved'} onChange={e => setEditingSong({...editingSong, license_type: e.target.value})} style={inputStyle}>
                            <option value="all_rights_reserved">Todos los derechos reservados</option>
                            <option value="creative_commons">Creative Commons</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        <div>
                          <label style={labelStyle}>Código ISRC (Opcional)</label>
                          <input type="text" value={editingSong.isrc || ''} onChange={e => setEditingSong({...editingSong, isrc: e.target.value})} style={inputStyle} placeholder="Ej: USRC17600001" />
                        </div>
                        <div>
                          <label style={labelStyle}>Código UPC (Opcional)</label>
                          <input type="text" value={editingSong.upc || ''} onChange={e => setEditingSong({...editingSong, upc: e.target.value})} style={inputStyle} placeholder="Ej: 060255712345" />
                        </div>
                      </div>

                      <div>
                        <label style={labelStyle}>Letra de la Canción (Opcional)</label>
                        <textarea rows={3} value={editingSong.lyrics || ''} onChange={e => setEditingSong({...editingSong, lyrics: e.target.value})} style={{ ...inputStyle, fontFamily: 'sans-serif', resize: 'vertical' }} />
                      </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button onClick={() => setEditingSong(null)} style={btnSecondary}>Cancelar</button>
                      <button onClick={handleUpdateSongDetails} style={btnPrimary}>
                        {isSavingSong ? 'Guardando...' : <><Save size={16} /> Actualizar Canción</>}
                      </button>
                    </div>
                  </div>
                ) : (
                  /* VISTA B: LISTADO ESTÁNDAR DE CANCIONES */
                  <div>
                    <h3 style={{ fontSize: '16px', fontWeight: '600', color: isDark ? '#fff' : '#111', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Music size={20} color="#dc2626" /> Lista de Canciones en este Álbum
                    </h3>
                    
                    <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {songsList.length > 0 ? (
                        songsList.map((song, index) => (
                          <div key={song.id || index} style={{
                            padding: '12px', background: isDark ? '#1f2937' : '#fff',
                            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`, borderRadius: '8px',
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                          }}>
                            <div>
                              <div style={{ fontWeight: '600', color: isDark ? '#fff' : '#111', fontSize: '14px' }}>
                                {index + 1}. {song.title}
                              </div>
                              <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                                Licencia: {song.license_type === 'all_rights_reserved' ? 'Derechos Reservados' : 'Creative Commons'}
                              </div>
                            </div>
                            
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <span style={{ fontSize: '12px', padding: '4px 8px', background: isDark ? '#111' : '#f3f4f6', borderRadius: '4px', color: '#9ca3af' }}>
                                {song.language?.toUpperCase() || 'SPA'}
                              </span>
                              
                              {/* Botón Editar */}
                              <button 
                                onClick={() => setEditingSong(song)}
                                style={{
                                  background: 'none', border: 'none', cursor: 'pointer',
                                  color: isDark ? '#9ca3af' : '#4b5563', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '500'
                                }}
                              >
                                <Edit3 size={14} /> Edit
                              </button>

                              {/* 🗑️ BOTÓN ELIMINAR INTEGRADO */}
                              <button 
                                onClick={() => setDeleteSongModal({ open: true, songId: song.id, songTitle: song.title })}
                                style={{
                                  background: 'none', border: 'none', cursor: 'pointer',
                                  color: '#ef4444', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontWeight: '500'
                                }}
                              >
                                <Trash2 size={14} /> Delete
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div style={{ textAlign: 'center', padding: '20px', color: '#6b7280', fontSize: '14px' }}>
                          Este álbum no tiene canciones asignadas todavía.
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <button onClick={() => setCurrentStep(2)} style={btnSecondary}>Anterior</button>
                      <button onClick={() => {
                        if (onUpdated) onUpdated() 
                        onClose()
                      }} style={btnPrimary}>
                        <Save size={16} /> Finalizar Edición
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ⚠️ MODAL INTERNO: CONFIRMACIÓN PARA BORRAR CANCIÓN */}
      {deleteSongModal.open && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1100, padding: '20px'
        }}>
          <div style={{
            background: isDark ? '#1f2937' : '#ffffff', borderRadius: '12px',
            width: '100%', maxWidth: '400px', padding: '20px', textAlign: 'center',
            border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)'
          }}>
            <AlertTriangle size={40} color="#ef4444" style={{ margin: '0 auto 12px' }} />
            
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: isDark ? '#fff' : '#111', margin: '0 0 8px 0' }}>
              ¿Eliminar canción?
            </h3>
            
            <p style={{ fontSize: '14px', color: isDark ? '#9ca3af' : '#6b7280', margin: '0 0 20px 0' }}>
              Estás a punto de borrar definitivamente la canción <strong>"{deleteSongModal.songTitle}"</strong>. Esta acción no se puede deshacer.
            </p>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button 
                disabled={isDeletingSong}
                onClick={() => setDeleteSongModal({ open: false, songId: null, songTitle: '' })} 
                style={{ ...btnSecondary, padding: '10px 16px' }}
              >
                Cancelar
              </button>
              <button 
                disabled={isDeletingSong}
                onClick={handleDeleteSong} 
                style={{ ...btnDanger, padding: '10px 16px' }}
              >
                {isDeletingSong ? 'Eliminando...' : 'Sí, eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}