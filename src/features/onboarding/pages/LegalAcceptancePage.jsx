import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useThemeStore } from '../../../app/store'
import { onboardingService } from '../../../services/api'
import { FileText, CheckCircle, ArrowRight, AlertCircle, ExternalLink } from 'lucide-react'

function LegalAcceptancePage() {
  const { theme } = useThemeStore()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  const [documents, setDocuments] = useState([])
  const [acceptedDocuments, setAcceptedDocuments] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [userId, setUserId] = useState(null)

  useEffect(() => {
    // Obtener el user_id del store o localStorage
    const authStorage = localStorage.getItem('auth-storage')
    if (authStorage) {
      try {
        const auth = JSON.parse(authStorage)
        if (auth.state?.user?.id) {
          setUserId(auth.state.user.id)
        }
      } catch (err) {
        console.error('Error parsing auth storage:', err)
      }
    }

    // Cargar documentos legales disponibles
    loadLegalDocuments()
  }, [])

  const loadLegalDocuments = async () => {
    try {
      const legalDocs = await onboardingService.getLegalDocuments()
      
      // Validar que legalDocs sea un array
      if (!Array.isArray(legalDocs)) {
        console.warn('Legal documents is not an array:', legalDocs)
        // Usar documentos de ejemplo si el backend no responde correctamente
        const mockDocuments = [
          {
            id: 1,
            type: 'artist_contract',
            title: 'Contrato de Artista',
            content: 'Este es el contrato de artista que establece los términos de nuestra colaboración...',
            version: '1.0'
          },
          {
            id: 2,
            type: 'terms',
            title: 'Términos y Condiciones',
            content: 'Términos generales de uso de la plataforma BITU ARTIST...',
            version: '1.0'
          },
          {
            id: 3,
            type: 'copyright',
            title: 'Derechos de Autor',
            content: 'Acuerdo de derechos de autor y licenciamiento de tu contenido...',
            version: '1.0'
          },
          {
            id: 4,
            type: 'privacy_policy',
            title: 'Política de Privacidad',
            content: 'Cómo protegemos y manejamos tu información personal...',
            version: '1.0'
          }
        ]
        
        // Filtrar documentos relevantes para artistas
        const artistDocuments = mockDocuments.filter(doc => 
          ['artist_contract', 'terms', 'copyright', 'privacy_policy', 'data_consent', 'content_license'].includes(doc.type)
        )
        
        setDocuments(artistDocuments)
        
        // Inicializar estado de aceptación
        const initialState = {}
        artistDocuments.forEach(doc => {
          initialState[doc.id] = false
        })
        setAcceptedDocuments(initialState)
        return
      }
      
      // Filtrar documentos relevantes para artistas
      const artistDocuments = legalDocs.filter(doc => 
        ['artist_contract', 'terms', 'copyright', 'privacy_policy', 'data_consent', 'content_license'].includes(doc.type)
      )
      
      setDocuments(artistDocuments)
      
      // Inicializar estado de aceptación
      const initialState = {}
      artistDocuments.forEach(doc => {
        initialState[doc.id] = false
      })
      setAcceptedDocuments(initialState)
    } catch (err) {
      console.error('Error loading legal documents:', err)
      setError('Error al cargar los documentos legales')
    }
  }

  const handleDocumentToggle = (documentId) => {
    setAcceptedDocuments(prev => ({
      ...prev,
      [documentId]: !prev[documentId]
    }))
  }

  const validateForm = () => {
    // Verificar que todos los documentos obligatorios estén aceptados
    const requiredDocuments = documents.filter(doc => 
      ['artist_contract', 'terms', 'copyright'].includes(doc.type)
    )

    for (const doc of requiredDocuments) {
      if (!acceptedDocuments[doc.id]) {
        setError(`Debes aceptar el documento: ${doc.title || doc.type}`)
        return false
      }
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) {
      return
    }

    if (!userId) {
      setError('No se encontró información del usuario. Por favor inicia sesión nuevamente.')
      return
    }

    setLoading(true)

    try {
      // Enviar aceptaciones para los documentos seleccionados
      const acceptedIds = Object.keys(acceptedDocuments).filter(id => acceptedDocuments[id])
      
      const promises = acceptedIds.map(documentId =>
        onboardingService.acceptLegalDocument(userId, parseInt(documentId))
      )

      await Promise.all(promises)
      
      // Limpiar localStorage de onboarding
      localStorage.removeItem('current_artist_id')
      localStorage.removeItem('artist_profile_skipped')
      
      // Redirigir al dashboard
      navigate('/app')
    } catch (err) {
      setError(err.message || 'Error al procesar las aceptaciones legales. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const getDocumentTitle = (type) => {
    const titles = {
      artist_contract: 'Contrato de Artista',
      terms: 'Términos y Condiciones',
      copyright: 'Derechos de Autor',
      privacy_policy: 'Política de Privacidad',
      data_consent: 'Consentimiento de Datos',
      content_license: 'Licencia de Contenido',
      moderation_policy: 'Política de Moderación',
      monetization_terms: 'Términos de Monetización',
      cookies_policy: 'Política de Cookies',
      notifications_policy: 'Política de Notificaciones'
    }
    return titles[type] || type
  }

  const getDocumentDescription = (type) => {
    const descriptions = {
      artist_contract: 'Contrato que establece los términos de nuestra colaboración y distribución de tu música.',
      terms: 'Términos generales de uso de la plataforma BITU ARTIST.',
      copyright: 'Acuerdo de derechos de autor y licenciamiento de tu contenido.',
      privacy_policy: 'Cómo protegemos y manejamos tu información personal.',
      data_consent: 'Consentimiento para el procesamiento de tus datos.',
      content_license: 'Licencia para distribuir tu contenido en nuestra plataforma.',
      moderation_policy: 'Normas y directrices para el contenido publicado.',
      monetization_terms: 'Términos para la monetización de tu contenido.',
      cookies_policy: 'Uso de cookies y tecnologías de seguimiento.',
      notifications_policy: 'Cómo manejamos las comunicaciones y notificaciones.'
    }
    return descriptions[type] || 'Documento legal importante para tu uso de la plataforma.'
  }

  const isRequired = (type) => {
    return ['artist_contract', 'terms', 'copyright'].includes(type)
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
        maxWidth: '900px',
        background: isDark ? '#1f2937' : '#fff',
        borderRadius: '16px',
        padding: '40px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <FileText size={40} color="#dc2626" />
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            margin: 0,
            color: isDark ? '#fff' : '#111'
          }}>
            Documentos Legales
          </h1>
          <p style={{
            fontSize: '16px',
            color: isDark ? '#9ca3af' : '#6b7280',
            margin: '8px 0 0 0'
          }}>
            Revisa y acepta los documentos legales para completar tu registro
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
                background: stepNumber <= 6 ? '#dc2626' : (isDark ? '#374151' : '#e5e7eb'),
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
            Paso 6 de 6 - Documentos Legales
          </div>
        </div>

        {/* Important Notice */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '8px',
          padding: '16px',
          marginBottom: '24px',
          display: 'flex',
          alignItems: 'start',
          gap: '12px'
        }}>
          <AlertCircle size={20} color="#3b82f6" style={{ marginTop: '2px' }} />
          <div>
            <p style={{
              margin: 0,
              fontSize: '14px',
              color: isDark ? '#93c5fd' : '#1e40af',
              fontWeight: 500
            }}>
              Importante: Lee cuidadosamente cada documento antes de aceptar.
            </p>
            <p style={{
              margin: '4px 0 0 0',
              fontSize: '12px',
              color: isDark ? '#9ca3af' : '#6b7280'
            }}>
              Los documentos marcados con * son obligatorios para usar la plataforma.
            </p>
          </div>
        </div>

        {/* Legal Documents */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '24px' }}>
            {documents.map((document) => (
              <div key={document.id} style={{
                background: isDark ? '#111' : '#f9fafb',
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '16px'
              }}>
                {/* Document Header */}
                <div style={{
                  display: 'flex',
                  alignItems: 'start',
                  gap: '16px',
                  marginBottom: '12px'
                }}>
                  <input
                    type="checkbox"
                    id={`document-${document.id}`}
                    checked={acceptedDocuments[document.id] || false}
                    onChange={() => handleDocumentToggle(document.id)}
                    style={{
                      width: '20px',
                      height: '20px',
                      marginTop: '2px',
                      cursor: 'pointer'
                    }}
                  />
                  
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px'
                    }}>
                      <label
                        htmlFor={`document-${document.id}`}
                        style={{
                          fontSize: '16px',
                          fontWeight: 600,
                          color: isDark ? '#fff' : '#111',
                          cursor: 'pointer',
                          margin: 0
                        }}
                      >
                        {getDocumentTitle(document.type)}
                        {isRequired(document.type) && (
                          <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
                        )}
                      </label>
                      
                      <button
                        type="button"
                        onClick={() => {
                          // Aquí podría abrir el documento en una nueva ventana o modal
                          console.log('Ver documento:', document)
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#3b82f6',
                          cursor: 'pointer',
                          padding: '2px',
                          borderRadius: '4px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(59, 130, 246, 0.1)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent'
                        }}
                      >
                        <ExternalLink size={14} />
                        Ver completo
                      </button>
                    </div>
                    
                    <p style={{
                      margin: 0,
                      fontSize: '14px',
                      color: isDark ? '#9ca3af' : '#6b7280',
                      lineHeight: '1.5'
                    }}>
                      {getDocumentDescription(document.type)}
                    </p>
                    
                    <div style={{
                      marginTop: '8px',
                      fontSize: '12px',
                      color: isDark ? '#6b7280' : '#9ca3af'
                    }}>
                      Versión: {document.version} • 
                      {isRequired(document.type) ? ' Obligatorio' : ' Opcional'}
                    </div>
                  </div>
                </div>

                {/* Document Content Preview */}
                <div style={{
                  background: isDark ? '#1f2937' : '#fff',
                  border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                  borderRadius: '8px',
                  padding: '16px',
                  marginTop: '12px'
                }}>
                  <div style={{
                    fontSize: '13px',
                    color: isDark ? '#9ca3af' : '#6b7280',
                    lineHeight: '1.6',
                    maxHeight: '120px',
                    overflowY: 'auto'
                  }}>
                    {document.content ? (
                      <div>
                        {document.content.substring(0, 500)}...
                        <div style={{
                          marginTop: '8px',
                          fontStyle: 'italic',
                          color: isDark ? '#6b7280' : '#9ca3af'
                        }}>
                          (Vista previa - Haz clic en "Ver completo" para leer el documento completo)
                        </div>
                      </div>
                    ) : (
                      <div style={{ fontStyle: 'italic' }}>
                        Contenido del documento no disponible para vista previa.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

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
              onClick={() => navigate('/app')}
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

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 32px',
                background: loading ? '#9ca3af' : '#dc2626',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? (
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
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle size={16} />
                  Completar Registro
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LegalAcceptancePage
