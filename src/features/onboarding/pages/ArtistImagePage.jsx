import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '../../../app/store'
import { onboardingService } from '../../../services/api'
import { Music, Upload, X, ArrowRight, Image as ImageIcon } from 'lucide-react'

function ArtistImagePage() {
  const { theme } = useThemeStore()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef(null)

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        setError('Por favor selecciona una imagen válida')
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('La imagen no debe pesar más de 5MB')
        return
      }

      setSelectedFile(file)
      setError('')

      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreview(e.target.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      handleFileSelect({ target: { files: [file] } })
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreview(null)
    setError('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Por favor selecciona una imagen')
      return
    }

    // Obtener el artist_id del localStorage o usar un valor temporal
    const artistId = localStorage.getItem('current_artist_id')
    
    if (!artistId) {
      setError('No se encontró el ID del artista. Por favor regresa y completa el perfil primero.')
      return
    }

    setUploading(true)
    setError('')

    try {
      await onboardingService.uploadArtistImage(artistId, selectedFile)
      navigate('/onboarding/band-members')
    } catch (err) {
      setError(err.message || 'Error al subir la imagen del artista. Intenta nuevamente.')
    } finally {
      setUploading(false)
    }
  }

  const skipForNow = () => {
    navigate('/onboarding/band-members')
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: isDark ? '#111' : '#f3f4f6',
      padding: '24px'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '600px',
        background: isDark ? '#1f2937' : '#fff',
        borderRadius: '16px',
        padding: '40px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <ImageIcon size={40} color="#dc2626" />
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            margin: 0,
            color: isDark ? '#fff' : '#111'
          }}>
            Sube tu Imagen de Artista
          </h1>
          <p style={{
            fontSize: '16px',
            color: isDark ? '#9ca3af' : '#6b7280',
            margin: '8px 0 0 0'
          }}>
            La imagen que representará tu marca como artista
          </p>
        </div>

        {/* Progress Steps */}
        <div style={{
          marginBottom: '32px'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: '8px',
            gap: '8px'
          }}>
            {[1, 2, 3, 4, 5, 6].map((stepNumber) => (
              <div key={stepNumber} style={{
                width: '32px',
                height: '4px',
                background: stepNumber <= 4 ? '#dc2626' : (isDark ? '#374151' : '#e5e7eb'),
                borderRadius: '2px',
                transition: 'background 0.3s ease'
              }} />
            ))}
          </div>
          <div style={{
            textAlign: 'center',
            fontSize: '12px',
            color: isDark ? '#9ca3af' : '#6b7280',
            fontWeight: 500
          }}>
            Paso 4 de 6 - Imagen de Artista
          </div>
        </div>

        {/* Upload Area */}
        <div style={{ marginBottom: '24px' }}>
          {!preview ? (
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: `2px dashed ${isDark ? '#374151' : '#d1d5db'}`,
                borderRadius: '12px',
                padding: '60px 40px',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: isDark ? '#111' : '#f9fafb'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#dc2626'
                e.currentTarget.style.background = isDark ? '#1f2937' : '#fef2f2'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isDark ? '#374151' : '#d1d5db'
                e.currentTarget.style.background = isDark ? '#111' : '#f9fafb'
              }}
            >
              <Upload size={64} color={isDark ? '#6b7280' : '#9ca3af'} style={{ marginBottom: '20px' }} />
              <p style={{
                fontSize: '18px',
                fontWeight: 600,
                color: isDark ? '#fff' : '#111',
                margin: '0 0 12px 0'
              }}>
                Arrastra tu imagen aquí
              </p>
              <p style={{
                fontSize: '16px',
                color: isDark ? '#9ca3af' : '#6b7280',
                margin: '0 0 8px 0'
              }}>
                o haz clic para seleccionar
              </p>
              <p style={{
                fontSize: '14px',
                color: isDark ? '#6b7280' : '#9ca3af',
                margin: 0
              }}>
                Formatos: JPG, PNG, GIF (máx. 5MB)
              </p>
              <p style={{
                fontSize: '12px',
                color: isDark ? '#6b7280' : '#9ca3af',
                margin: '16px 0 0 0',
                fontStyle: 'italic'
              }}>
                Recomendado: 1080x1080px, formato cuadrado
              </p>
            </div>
          ) : (
            <div style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              background: isDark ? '#111' : '#f9fafb',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
            }}>
              <img
                src={preview}
                alt="Artist image preview"
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  display: 'block'
                }}
              />
              <button
                onClick={removeFile}
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: 'rgba(0, 0, 0, 0.7)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '40px',
                  height: '40px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'background 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(220, 38, 38, 0.9)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(0, 0, 0, 0.7)'
                }}
              >
                <X size={20} color="#fff" />
              </button>
              <div style={{
                position: 'absolute',
                bottom: '12px',
                left: '12px',
                background: 'rgba(0, 0, 0, 0.7)',
                color: '#fff',
                padding: '8px 12px',
                borderRadius: '8px',
                fontSize: '12px'
              }}>
                {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
              </div>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />

        {/* Error message */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '12px',
            marginBottom: '24px',
            color: '#ef4444',
            fontSize: '14px'
          }}>
            {error}
            {error.includes('artist') && (
              <div style={{ marginTop: '8px', fontSize: '12px' }}>
                Puedes continuar con el onboarding y subir tu imagen más tarde.
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '16px'
        }}>
          <button
            type="button"
            onClick={skipForNow}
            style={{
              padding: '12px 24px',
              background: 'transparent',
              color: isDark ? '#9ca3af' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Omitir por ahora
          </button>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || uploading}
              style={{
                padding: '12px 32px',
                background: (!selectedFile || uploading) ? '#9ca3af' : '#dc2626',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: (!selectedFile || uploading) ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: (!selectedFile || uploading) ? 0.7 : 1
              }}
            >
              {uploading ? (
                <>
                  <div style={{
                    width: '16px',
                    height: '16px',
                    border: '2px solid #fff',
                    borderTop: '2px solid transparent',
                    borderRight: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }} />
                  Subiendo...
                </>
              ) : (
                <>
                  Subir imagen
                  <ArrowRight size={16} />
                </>
              )}
            </button>

            {error && (
              <button
                type="button"
                onClick={skipForNow}
                style={{
                  padding: '12px 24px',
                  background: '#6b7280',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                Continuar igualmente
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtistImagePage
