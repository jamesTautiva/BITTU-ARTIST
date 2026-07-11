import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../../app/store'
import { useThemeStore } from '../../../app/store'
import { authService } from '../../../services/api'
import { Music, Mail, Lock, Eye, EyeOff, User, ArrowRight } from 'lucide-react'

function Register() {
  const { theme } = useThemeStore()
  const { login } = useAuthStore()
  const navigate = useNavigate()
  const isDark = theme === 'dark'

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false
  })

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [step, setStep] = useState(1)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido'
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres'
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmar contraseña es requerido'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    
        
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'Debes aceptar los términos y condiciones'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Si no estamos en el último paso, avanzar al siguiente
    if (step < 2) {
      // Validar solo los campos del paso actual
      const stepErrors = {}
      
      if (step === 1) {
        if (!formData.username.trim()) {
          stepErrors.username = 'El nombre de usuario es requerido'
        }
        if (!formData.email.trim()) {
          stepErrors.email = 'El correo electrónico es requerido'
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
          stepErrors.email = 'El correo electrónico no es válido'
        }
      }
      
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors)
        return
      }
      
      // Avanzar al siguiente paso
      setStep(step + 1)
      setErrors({})
      return
    }
    
    // Estamos en el último paso, validar contraseña y términos
    const stepErrors = {}
    
    if (!formData.password) {
      stepErrors.password = 'La contraseña es requerida'
    } else if (formData.password.length < 8) {
      stepErrors.password = 'La contraseña debe tener al menos 8 caracteres'
    }
    
    if (!formData.confirmPassword) {
      stepErrors.confirmPassword = 'Confirmar contraseña es requerido'
    } else if (formData.password !== formData.confirmPassword) {
      stepErrors.confirmPassword = 'Las contraseñas no coinciden'
    }
    
    if (!formData.agreeToTerms) {
      stepErrors.agreeToTerms = 'Debes aceptar los términos y condiciones'
    }
    
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors)
      return
    }

    setLoading(true)
    setErrors({})

    try {
      // Registrar usuario con role artist usando authService
      const response = await authService.register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: 'artist'
      })

      // Guardar en el store de Zustand con estructura consistente
      const userData = {
        id: response.user?.id || response.id,
        username: response.user?.username || response.username,
        email: response.user?.email || response.email,
        role: response.user?.role || response.role || 'artist',
        avatar_url: response.user?.avatar_url || response.avatar_url,
        token: response.token || response.user?.token
      }
      
      console.log('Login user data:', userData)
      login(userData)

      // Redirigir a onboarding en lugar de dashboard
      navigate('/onboarding/avatar')
    } catch (err) {
      setErrors({ submit: err.message || 'Error al registrar. Intenta nuevamente.' })
    } finally {
      setLoading(false)
    }
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
        maxWidth: '500px',
        background: isDark ? '#1f2937' : '#fff',
        borderRadius: '16px',
        padding: '40px',
        border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
            <Music size={40} color="#dc2626" />
          </div>
          <h1 style={{
            fontSize: '28px',
            fontWeight: 700,
            margin: 0,
            color: isDark ? '#fff' : '#111'
          }}>
            Crear Cuenta
          </h1>
          <p style={{
            fontSize: '16px',
            color: isDark ? '#9ca3af' : '#6b7280',
            margin: '8px 0 0 0'
          }}>
            Únete a BITU ARTIST y comienza tu carrera musical
          </p>
        </div>

        {/* Progress Steps - Contexto completo del onboarding */}
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
                background: stepNumber <= step ? '#dc2626' : (isDark ? '#374151' : '#e5e7eb'),
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
            Paso {step} de 6 - Registro
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Step 1: Basic Info */}
          {step === 1 && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: isDark ? '#fff' : '#111',
                  marginBottom: '8px'
                }}>
                  Nombre de Usuario
                </label>
                <div style={{ position: 'relative' }}>
                  <User size={18} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: isDark ? '#6b7280' : '#9ca3af'
                  }} />
                  <input
                    type="text"
                    name="username"
                    placeholder="Tu nombre de usuario"
                    value={formData.username}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      background: isDark ? '#111' : '#f9fafb',
                      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#111',
                      fontSize: '14px'
                    }}
                  />
                </div>
                {errors.username && (
                  <div style={{
                    color: '#ef4444',
                    fontSize: '12px',
                    marginTop: '4px'
                  }}>
                    {errors.username}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: isDark ? '#fff' : '#111',
                  marginBottom: '8px'
                }}>
                  Correo Electrónico
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: isDark ? '#6b7280' : '#9ca3af'
                  }} />
                  <input
                    type="email"
                    name="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      background: isDark ? '#111' : '#f9fafb',
                      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#111',
                      fontSize: '14px'
                    }}
                  />
                </div>
                {errors.email && (
                  <div style={{
                    color: '#ef4444',
                    fontSize: '12px',
                    marginTop: '4px'
                  }}>
                    {errors.email}
                  </div>
                )}
              </div>
            </>
          )}

          
          {/* Step 2: Password and Terms */}
          {step === 2 && (
            <>
              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: isDark ? '#fff' : '#111',
                  marginBottom: '8px'
                }}>
                  Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: isDark ? '#6b7280' : '#9ca3af'
                  }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="Crea una contraseña segura"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      background: isDark ? '#111' : '#f9fafb',
                      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#111',
                      fontSize: '14px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: isDark ? '#6b7280' : '#9ca3af'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <div style={{
                    color: '#ef4444',
                    fontSize: '12px',
                    marginTop: '4px'
                  }}>
                    {errors.password}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: isDark ? '#fff' : '#111',
                  marginBottom: '8px'
                }}>
                  Confirmar Contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: isDark ? '#6b7280' : '#9ca3af'
                  }} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    placeholder="Repite tu contraseña"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 12px 12px 40px',
                      background: isDark ? '#111' : '#f9fafb',
                      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                      borderRadius: '8px',
                      color: isDark ? '#fff' : '#111',
                      fontSize: '14px'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: isDark ? '#6b7280' : '#9ca3af'
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <div style={{
                    color: '#ef4444',
                    fontSize: '12px',
                    marginTop: '4px'
                  }}>
                    {errors.confirmPassword}
                  </div>
                )}
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '14px',
                  color: isDark ? '#fff' : '#111',
                  cursor: 'pointer'
                }}>
                  <input
                    type="checkbox"
                    name="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    style={{ width: '16px', height: '16px' }}
                  />
                  Acepto los términos y condiciones de servicio
                </label>
                {errors.agreeToTerms && (
                  <div style={{
                    color: '#ef4444',
                    fontSize: '12px',
                    marginTop: '4px'
                  }}>
                    {errors.agreeToTerms}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Navigation Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '32px'
          }}>
            <button
              type="button"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              style={{
                padding: '12px 24px',
                background: 'transparent',
                color: isDark ? '#fff' : '#111',
                border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: 500,
                cursor: step === 1 ? 'not-allowed' : 'pointer',
                opacity: step === 1 ? 0.5 : 1
              }}
            >
              Anterior
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
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
                  {step < 2 ? 'Siguiente' : 'Crear Cuenta'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </div>

          {errors.submit && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '8px',
              padding: '12px',
              marginTop: '16px',
              color: '#ef4444',
              fontSize: '14px'
            }}>
              {errors.submit}
            </div>
          )}

          {/* Login Link */}
          <div style={{ textAlign: 'center', marginTop: '24px' }}>
            <span style={{ color: isDark ? '#9ca3af' : '#6b7280' }}>
              ¿Ya tienes cuenta?{' '}
            </span>
            <button
              type="button"
              onClick={() => navigate('/login')}
              style={{
                background: 'none',
                border: 'none',
                color: '#dc2626',
                fontSize: '14px',
                fontWeight: 500,
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Inicia sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
