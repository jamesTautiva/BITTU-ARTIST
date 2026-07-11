import { useState, useEffect } from 'react'
import { useThemeStore, useAuthStore } from '../../../app/store'
import { Music, Upload, Plus, ChevronRight, Save, Disc, Hash } from 'lucide-react'

function CreateAlbumPage({ onSuccess, onCancel }) {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const isDark = theme === 'dark'

  const [currentStep, setCurrentStep] = useState(1)
  const [albumData, setAlbumData] = useState({
    title: '',
    release_date: '',
    album_type: 'album',
    cover_image: null,
  })
  const [createdAlbumId, setCreatedAlbumId] = useState(null)
  const [albumInfoSent, setAlbumInfoSent] = useState(false)
  const [isUploadingCover, setIsUploadingCover] = useState(false)
  const [genres, setGenres] = useState([])
  const [selectedGenres, setSelectedGenres] = useState([])
  const [genreSearch, setGenreSearch] = useState('')
  const [activeGenreFilter, setActiveGenreFilter] = useState(null)
  const [composers, setComposers] = useState([])
  const [selectedComposers, setSelectedComposers] = useState([])
  const [newComposer, setNewComposer] = useState({ name: '', role: 'composer', bio: '' })
  const [showCreateForm, setShowCreateForm] = useState(false)

  // ✅ Estados de canciones al nivel del componente (no dentro de renderStep5)
  const [currentSong, setCurrentSong] = useState({
    title: '', lyrics: '', language: 'spa',
    license_type: 'all_rights_reserved',
    is_creative_commons: false, copyright: '',
    isrc: '', upc: '', audio_file: null
  })
  const [createdSongsList, setCreatedSongsList] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  const API = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
  const headers = { 'Authorization': `Bearer ${user?.token}` }
  const jsonHeaders = { ...headers, 'Content-Type': 'application/json' }

  useEffect(() => { loadGenres(); loadComposers() }, [])

  const loadGenres = async () => {
    try {
      const res = await fetch(`${API}/album/genres/all`, { headers })
      const data = await res.json()
      setGenres(Array.isArray(data) ? data : [])
    } catch {
      setGenres([{ id: 1, name: 'Rock' }, { id: 2, name: 'Pop' }, { id: 3, name: 'Jazz' }])
    }
  }

  const loadComposers = async () => {
    try {
      const res = await fetch(`${API}/composer/all`, { headers })
      const data = await res.json()
      setComposers(Array.isArray(data) ? data : [])
    } catch {
      setComposers([])
    }
  }

  const handleCreateComposer = async () => {
    if (!newComposer.name.trim()) { alert('❌ El nombre es requerido'); return }
    try {
      const res = await fetch(`${API}/composer/create`, {
        method: 'POST', headers: jsonHeaders, body: JSON.stringify(newComposer)
      })
      if (res.ok) {
        const created = await res.json()
        setComposers([...composers, created])
        setNewComposer({ name: '', role: 'composer', bio: '' })
        setShowCreateForm(false)
      }
    } catch (e) { console.error(e) }
  }

  const handleCreateSong = async () => {
    if (!currentSong.title) { alert('❌ El título es requerido'); return }
    if (!currentSong.audio_file) { alert('❌ Debes seleccionar un archivo de audio'); return }
    setIsUploading(true)
    try {
      // 1. Crear el registro base de la canción
      const songRes = await fetch(`${API}/song/create`, {
        method: 'POST', 
        headers: jsonHeaders,
        body: JSON.stringify({
          album_id: createdAlbumId,
          title: currentSong.title,
          lyrics: currentSong.lyrics || null,
          language: currentSong.language,
          license_type: currentSong.license_type,
          is_creative_commons: !!currentSong.is_creative_commons,
          copyright: currentSong.copyright || null,
          isrc: currentSong.isrc.trim() === "" ? null : currentSong.isrc.trim(),
          upc: currentSong.upc.trim() === "" ? null : currentSong.upc.trim()
        })
      })

      if (!songRes.ok) {
        const errorData = await songRes.text()
        throw new Error(`Error al registrar canción: ${errorData}`)
      }

      const createdSong = await songRes.json()
      
      // 2. Preparar el archivo de audio
      const formData = new FormData()
      formData.append('audio_file', currentSong.audio_file)
      
      // 3. Subir el archivo físico al servidor
      const uploadRes = await fetch(`${API}/upload/song/${createdSong.id}`, {
        method: 'POST', 
        headers, // Importante: Sin Content-Type JSON para que el navegador configure el boundary del FormData
        body: formData
      })
      
      if (uploadRes.ok) {
        // ✅ CLAVE: Capturamos la respuesta del servidor tras procesar el archivo.
        // Este objeto debería contener la propiedad 'audio_url', 'file_path' o similar actualizada.
        const updatedSongFromBackend = await uploadRes.json()

        setCreatedSongsList(prev => [
          ...prev, 
          { 
            ...(updatedSongFromBackend?.id ? updatedSongFromBackend : createdSong), // Fallback si el backend no devuelve el objeto completo
            audio_file_name: currentSong.audio_file.name 
          }
        ])

        // Limpiar el formulario para la siguiente canción
        setCurrentSong({ 
          title: '', lyrics: '', language: 'spa', 
          license_type: 'all_rights_reserved', is_creative_commons: false, 
          copyright: '', isrc: '', upc: '', audio_file: null 
        })
        alert('✅ Canción agregada con audio exitosamente')
      } else {
        const uploadError = await uploadRes.text()
        alert(`❌ Canción creada, pero falló la subida del archivo: ${uploadError}`)
      }
    } catch (e) { 
      console.error('=== CREATE SONG DEBUG ERROR ===', e)
      alert(`❌ No se pudo guardar la canción de manera completa.`)
    } finally { 
      setIsUploading(false) 
    }
  }

  const inputStyle = {
    width: '100%', padding: '12px',
    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
    borderRadius: '8px',
    background: isDark ? '#111' : '#fff',
    color: isDark ? '#fff' : '#111',
    fontSize: '14px', boxSizing: 'border-box'
  }

  const labelStyle = {
    display: 'block', fontSize: '14px',
    fontWeight: '500', color: isDark ? '#fff' : '#111', marginBottom: '8px'
  }

  const btnPrimary = {
    padding: '12px 24px', border: 'none', borderRadius: '8px',
    background: '#dc2626', color: '#fff', fontSize: '14px',
    cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px'
  }

  const btnSecondary = {
    padding: '12px 24px', borderRadius: '8px', background: 'transparent',
    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
    color: isDark ? '#9ca3af' : '#6b7280', fontSize: '14px', cursor: 'pointer'
  }

  const cardStyle = {
    background: isDark ? '#1f2937' : '#fff',
    borderRadius: '12px', padding: '24px',
    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
  }

  // ✅ STEP 1
  const renderStep1 = () => (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: isDark ? '#fff' : '#111', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Disc size={24} color="#dc2626" /> Información del Álbum
      </h2>
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr', marginBottom: '16px' }}>
        <div>
          <label style={labelStyle}>Título del Álbum *</label>
          <input type="text" value={albumData.title} onChange={e => setAlbumData({ ...albumData, title: e.target.value })} placeholder="Ej: Mi Primer Álbum" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Tipo de Álbum</label>
          <select value={albumData.album_type} onChange={e => setAlbumData({ ...albumData, album_type: e.target.value })} style={inputStyle}>
            <option value="album">Álbum</option>
            <option value="single">Sencillo</option>
            <option value="ep">EP</option>
            <option value="compilation">Compilación</option>
            <option value="live">En Vivo</option>
            <option value="remix">Remix</option>
          </select>
        </div>
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Fecha de Lanzamiento</label>
          <input type="date" value={albumData.release_date} onChange={e => setAlbumData({ ...albumData, release_date: e.target.value })} style={inputStyle} />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
        <button onClick={onCancel} style={btnSecondary}>Cancelar</button>
        <button style={btnPrimary} onClick={async () => {
          if (!albumData.title) { alert('Por favor ingresa el título'); return }
          try {
            const res = await fetch(`${API}/album/create`, {
              method: 'POST', headers: jsonHeaders,
              body: JSON.stringify({
                title: albumData.title,
                artist_id: user?.artist?.id,
                release_date: albumData.release_date,
                album_type: albumData.album_type,
                status: 'draft'
              })
            })
            if (res.ok) {
              const album = await res.json()
              setCreatedAlbumId(album.id)
              setAlbumInfoSent(true)
              setCurrentStep(2)
            } else { alert('❌ Error al guardar el álbum') }
          } catch (e) { console.error(e) }
        }}>
          {albumInfoSent ? '✅ Guardado' : 'Siguiente'} <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )

  // ✅ STEP 2
  const renderStep2 = () => (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: isDark ? '#fff' : '#111', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Upload size={24} color="#dc2626" /> Portada del Álbum
      </h2>
      <div style={{ border: `2px dashed ${isDark ? '#374151' : '#e5e7eb'}`, borderRadius: '12px', padding: '40px', textAlign: 'center' }}>
        <input type="file" accept="image/*" id="cover-upload" style={{ display: 'none' }}
          onChange={e => { if (e.target.files[0]) setAlbumData({ ...albumData, cover_image: e.target.files[0] }) }} />
        {albumData.cover_image
          ? <img src={URL.createObjectURL(albumData.cover_image)} alt="Cover" style={{ maxWidth: '200px', maxHeight: '200px', borderRadius: '8px', objectFit: 'cover', marginBottom: '16px' }} />
          : <Upload size={48} style={{ color: isDark ? '#6b7280' : '#9ca3af', marginBottom: '16px' }} />
        }
        <br />
        <label htmlFor="cover-upload" style={{ ...btnPrimary, display: 'inline-flex', cursor: 'pointer' }}>
          {albumData.cover_image ? 'Cambiar Portada' : 'Seleccionar Portada'}
        </label>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
        <button onClick={() => setCurrentStep(1)} style={btnSecondary}>Anterior</button>
        <button style={{ ...btnPrimary, background: isUploadingCover ? '#9ca3af' : '#dc2626' }} onClick={async () => {
          if (!albumData.cover_image) { setCurrentStep(3); return }
          setIsUploadingCover(true)
          try {
            const fd = new FormData()
            fd.append('cover_image', albumData.cover_image)
            const res = await fetch(`${API}/upload/album-cover/${createdAlbumId}`, { method: 'PUT', headers, body: fd })
            if (res.ok) setCurrentStep(3)
            else alert('❌ Error al subir portada')
          } catch (e) { console.error(e) } finally { setIsUploadingCover(false) }
        }}>
          {isUploadingCover ? 'Subiendo...' : <><Upload size={16} /> Subir Portada</>}
        </button>
      </div>
    </div>
  )

  // ✅ STEP 3
  const renderStep3 = () => {
    const filteredGenres = genres.filter(g =>
      g.name.toLowerCase().includes(genreSearch.toLowerCase()) &&
      (!activeGenreFilter || g.name.toLowerCase().includes(activeGenreFilter.toLowerCase()))
    )
    const toggleGenre = (genre) => {
      if (selectedGenres.find(g => g.id === genre.id)) {
        setSelectedGenres(selectedGenres.filter(g => g.id !== genre.id))
      } else {
        if (selectedGenres.length >= 2) { alert('Máximo 2 géneros'); return }
        setSelectedGenres([...selectedGenres, genre])
      }
    }
    return (
      <div style={cardStyle}>
        <h2 style={{ fontSize: '20px', fontWeight: '600', color: isDark ? '#fff' : '#111', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Hash size={24} color="#dc2626" /> Géneros Musicales
          <span style={{ fontSize: '14px', fontWeight: '400', color: '#9ca3af', marginLeft: 'auto' }}>{selectedGenres.length}/2</span>
        </h2>
        <input type="text" value={genreSearch} onChange={e => setGenreSearch(e.target.value)} placeholder="Buscar géneros..." style={{ ...inputStyle, marginBottom: '16px' }} />
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          {['Rock', 'Metal', 'Punk', 'Hardcore'].map(f => (
            <button key={f} onClick={() => setActiveGenreFilter(activeGenreFilter === f ? null : f)}
              style={{ padding: '8px 16px', borderRadius: '6px', border: `1px solid ${activeGenreFilter === f ? '#dc2626' : isDark ? '#374151' : '#e5e7eb'}`, background: activeGenreFilter === f ? '#dc2626' : 'transparent', color: activeGenreFilter === f ? '#fff' : isDark ? '#fff' : '#111', fontSize: '12px', cursor: 'pointer' }}>
              {f}
            </button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px', maxHeight: '300px', overflowY: 'auto', marginBottom: '24px' }}>
          {filteredGenres.map(genre => (
            <div key={genre.id} onClick={() => toggleGenre(genre)} style={{
              padding: '12px', borderRadius: '8px', textAlign: 'center', cursor: 'pointer', fontSize: '14px',
              border: `2px solid ${selectedGenres.find(g => g.id === genre.id) ? '#dc2626' : isDark ? '#374151' : '#e5e7eb'}`,
              background: selectedGenres.find(g => g.id === genre.id) ? '#dc2626' : 'transparent',
              color: selectedGenres.find(g => g.id === genre.id) ? '#fff' : isDark ? '#fff' : '#111',
            }}>{genre.name}</div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button onClick={() => setCurrentStep(2)} style={btnSecondary}>Anterior</button>
          <button style={btnPrimary} onClick={async () => {
            if (selectedGenres.length === 0) { setCurrentStep(4); return }
            for (const genre of selectedGenres) {
              await fetch(`${API}/album/genres/create`, {
                method: 'POST', headers: jsonHeaders,
                body: JSON.stringify({ album_id: createdAlbumId, genre_id: genre.id })
              })
            }
            setCurrentStep(4)
          }}>
            Siguiente <ChevronRight size={16} />
          </button>
        </div>
      </div>
    )
  }

  // ✅ STEP 4 - Compositores
  const renderStep4 = () => (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: isDark ? '#fff' : '#111', marginBottom: '24px' }}>
        Compositores
      </h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {composers.map(c => (
          <div key={c.id} onClick={() => {
            if (selectedComposers.find(s => s.id === c.id)) setSelectedComposers(selectedComposers.filter(s => s.id !== c.id))
            else setSelectedComposers([...selectedComposers, c])
          }} style={{
            padding: '12px', borderRadius: '8px', cursor: 'pointer',
            border: `2px solid ${selectedComposers.find(s => s.id === c.id) ? '#dc2626' : isDark ? '#374151' : '#e5e7eb'}`,
            background: selectedComposers.find(s => s.id === c.id) ? '#dc262620' : 'transparent',
            color: isDark ? '#fff' : '#111'
          }}>
            <div style={{ fontWeight: '600' }}>{c.name}</div>
            <div style={{ fontSize: '12px', color: '#9ca3af' }}>{c.role}</div>
          </div>
        ))}
      </div>

      {/* Crear compositor */}
      <button onClick={() => setShowCreateForm(!showCreateForm)} style={{ ...btnSecondary, marginBottom: '16px' }}>
        <Plus size={16} /> Nuevo Compositor
      </button>

      {showCreateForm && (
        <div style={{ padding: '16px', background: isDark ? '#111' : '#f9fafb', borderRadius: '8px', marginBottom: '16px' }}>
          <div style={{ display: 'grid', gap: '12px' }}>
            <div><label style={labelStyle}>Nombre *</label><input value={newComposer.name} onChange={e => setNewComposer({ ...newComposer, name: e.target.value })} style={inputStyle} /></div>
            <div>
              <label style={labelStyle}>Rol</label>
              <select value={newComposer.role} onChange={e => setNewComposer({ ...newComposer, role: e.target.value })} style={inputStyle}>
                <option value="composer">Compositor</option>
                <option value="lyricist">Letrista</option>
                <option value="producer">Productor</option>
                <option value="arranger">Arreglista</option>
              </select>
            </div>
            <button onClick={handleCreateComposer} style={btnPrimary}>Crear Compositor</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => setCurrentStep(3)} style={btnSecondary}>Anterior</button>
        <button onClick={() => setCurrentStep(5)} style={btnPrimary}>Siguiente <ChevronRight size={16} /></button>
      </div>
    </div>
  )

  // ✅ STEP 5 - Canciones
  const renderStep5 = () => (
    <div style={cardStyle}>
      <h2 style={{ fontSize: '20px', fontWeight: '600', color: isDark ? '#fff' : '#111', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Music size={24} color="#dc2626" /> Agregar Canciones
      </h2>

      {createdSongsList.length > 0 && (
        <div style={{ marginBottom: '24px', padding: '16px', background: isDark ? '#065f46' : '#d1fae5', borderRadius: '8px' }}>
          <h3 style={{ color: isDark ? '#d1fae5' : '#065f46', marginBottom: '12px' }}>Canciones ({createdSongsList.length})</h3>
          {createdSongsList.map((s, i) => (
            <div key={s.id} style={{ padding: '8px', background: isDark ? '#047857' : '#a7f3d0', borderRadius: '4px', marginBottom: '8px', display: 'flex', justifyContent: 'space-between' }}>
              <div style={{ color: isDark ? '#fff' : '#064e3b' }}><strong>{i + 1}. {s.title}</strong><div style={{ fontSize: '12px' }}>{s.audio_file_name}</div></div>
              <span style={{ padding: '4px 8px', background: '#10b981', color: '#fff', borderRadius: '4px', fontSize: '12px' }}>✓</span>
            </div>
          ))}
        </div>
      )}

      <div style={{ padding: '20px', background: isDark ? '#111' : '#f9fafb', borderRadius: '8px', marginBottom: '24px' }}>
        <h3 style={{ color: isDark ? '#fff' : '#111', marginBottom: '16px' }}>Nueva Canción</h3>
        <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Título *</label>
            <input value={currentSong.title} onChange={e => setCurrentSong({ ...currentSong, title: e.target.value })} placeholder="Ej: Mi Canción" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Archivo de Audio *</label>
            <input type="file" accept="audio/*" onChange={e => setCurrentSong({ ...currentSong, audio_file: e.target.files[0] })} style={inputStyle} />
            {currentSong.audio_file && <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>✓ {currentSong.audio_file.name}</div>}
          </div>
          <div>
            <label style={labelStyle}>Idioma</label>
            <select value={currentSong.language} onChange={e => setCurrentSong({ ...currentSong, language: e.target.value })} style={inputStyle}>
              <option value="spa">Español</option>
              <option value="eng">Inglés</option>
              <option value="fra">Francés</option>
              <option value="por">Portugués</option>
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Letra (Opcional)</label>
            <textarea value={currentSong.lyrics} onChange={e => setCurrentSong({ ...currentSong, lyrics: e.target.value })} rows={3} style={{ ...inputStyle, resize: 'vertical' }} />
          </div>
          <div>
            <label style={labelStyle}>Tipo de Licencia</label>
            <select value={currentSong.license_type} onChange={e => setCurrentSong({ ...currentSong, license_type: e.target.value, is_creative_commons: e.target.value !== 'all_rights_reserved' })} style={inputStyle}>
              <option value="all_rights_reserved">Todos los derechos reservados</option>
              <option value="cc_by">Creative Commons - Atribución</option>
              <option value="cc_by_nc">Creative Commons - NoComercial</option>
              <option value="public_domain">Dominio Público</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Copyright (Opcional)</label>
            <input value={currentSong.copyright} onChange={e => setCurrentSong({ ...currentSong, copyright: e.target.value })} placeholder="© 2024 Tu Nombre" style={inputStyle} />
          </div>
        </div>
        <button onClick={handleCreateSong} disabled={isUploading} style={{ ...btnPrimary, marginTop: '16px', background: isUploading ? '#9ca3af' : '#dc2626' }}>
          {isUploading ? 'Subiendo...' : <><Plus size={16} /> Agregar Canción</>}
        </button>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button onClick={() => setCurrentStep(4)} style={btnSecondary}>Anterior</button>
        <button style={btnPrimary} onClick={() => {
          if (onSuccess) onSuccess()
          else alert('🎉 ¡Álbum completado!')
        }}>
          <Save size={16} /> Finalizar Álbum
        </button>
      </div>
    </div>
  )

  // ✅ RETURN PRINCIPAL — fuera de cualquier función
  return (
    <div style={{ minHeight: '100%', background: isDark ? '#111' : '#f3f4f6', color: isDark ? '#fff' : '#111', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <button onClick={onCancel} style={btnSecondary}>← Volver</button>
        <h1 style={{ fontSize: '24px', fontWeight: '700', color: isDark ? '#fff' : '#111', margin: 0 }}>Crear Nuevo Álbum</h1>
        <div />
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px', gap: '8px' }}>
        {[1, 2, 3, 4, 5].map(s => (
          <div key={s} style={{ width: '40px', height: '4px', borderRadius: '2px', background: s <= currentStep ? '#dc2626' : isDark ? '#374151' : '#e5e7eb' }} />
        ))}
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderStep4()}
        {currentStep === 5 && renderStep5()}
      </div>
    </div>
  )
}

export default CreateAlbumPage