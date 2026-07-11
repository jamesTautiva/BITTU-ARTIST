import { useState } from 'react'
import { useThemeStore } from '../../../app/store'
import { Settings, Bell, Lock, Palette, Globe, HelpCircle } from 'lucide-react'

function SettingsPage() {
  const { theme, toggleTheme } = useThemeStore()
  const isDark = theme === 'dark'

  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      marketing: false,
      newFollowers: true,
      newPlays: true,
      comments: true
    },
    privacy: {
      profilePublic: true,
      showEmail: false,
      showLocation: true,
      allowMessages: true
    },
    preferences: {
      language: 'es',
      currency: 'MXN',
      autoPlay: true,
      highQuality: true
    }
  })

  const handleNotificationChange = (key) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [key]: !settings.notifications[key]
      }
    })
  }

  const handlePrivacyChange = (key) => {
    setSettings({
      ...settings,
      privacy: {
        ...settings.privacy,
        [key]: !settings.privacy[key]
      }
    })
  }

  const handlePreferenceChange = (key, value) => {
    setSettings({
      ...settings,
      preferences: {
        ...settings.preferences,
        [key]: value
      }
    })
  }

  const SettingsSection = ({ title, icon, children }) => (
    <div style={{
      background: isDark ? '#1f2937' : '#fff',
      border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
      borderRadius: '12px',
      padding: '24px',
      marginBottom: '24px'
    }}>
      <h2 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: isDark ? '#fff' : '#111',
        margin: '0 0 20px 0',
        display: 'flex',
        alignItems: 'center',
        gap: '8px'
      }}>
        {icon}
        {title}
      </h2>
      {children}
    </div>
  )

  const ToggleSwitch = ({ checked, onChange, label }) => (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 0',
      borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
    }}>
      <span style={{
        fontSize: '14px',
        color: isDark ? '#fff' : '#111'
      }}>
        {label}
      </span>
      <button
        onClick={onChange}
        style={{
          width: '44px',
          height: '24px',
          background: checked ? '#dc2626' : (isDark ? '#374151' : '#d1d5db'),
          border: 'none',
          borderRadius: '12px',
          position: 'relative',
          cursor: 'pointer',
          transition: 'background 0.2s ease'
        }}
      >
        <div style={{
          width: '20px',
          height: '20px',
          background: '#fff',
          borderRadius: '50%',
          position: 'absolute',
          top: '2px',
          left: checked ? '22px' : '2px',
          transition: 'left 0.2s ease'
        }} />
      </button>
    </div>
  )

  return (
    <div style={{ 
      width: '100%',
      margin: '0'
    }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '32px' }}>
        <Settings size={28} color="#dc2626" />
        <h1 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: isDark ? '#fff' : '#111',
          margin: 0
        }}>
          Configuración
        </h1>
      </div>

      {/* Appearance */}
      <SettingsSection title="Apariencia" icon={<Palette size={20} />}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 0'
        }}>
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '500',
              color: isDark ? '#fff' : '#111',
              marginBottom: '4px'
            }}>
              Tema
            </div>
            <div style={{
              fontSize: '12px',
              color: isDark ? '#9ca3af' : '#6b7280'
            }}>
              Selecciona tu preferencia de tema
            </div>
          </div>
          <select
            value={theme}
            onChange={toggleTheme}
            style={{
              padding: '8px 12px',
              background: isDark ? '#111' : '#f9fafb',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: isDark ? '#fff' : '#111',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="light">Claro</option>
            <option value="dark">Oscuro</option>
          </select>
        </div>
      </SettingsSection>

      {/* Notifications */}
      <SettingsSection title="Notificaciones" icon={<Bell size={20} />}>
        <ToggleSwitch
          checked={settings.notifications.email}
          onChange={() => handleNotificationChange('email')}
          label="Notificaciones por correo electrónico"
        />
        <ToggleSwitch
          checked={settings.notifications.push}
          onChange={() => handleNotificationChange('push')}
          label="Notificaciones push"
        />
        <ToggleSwitch
          checked={settings.notifications.marketing}
          onChange={() => handleNotificationChange('marketing')}
          label="Correos de marketing"
        />
        <ToggleSwitch
          checked={settings.notifications.newFollowers}
          onChange={() => handleNotificationChange('newFollowers')}
          label="Nuevos seguidores"
        />
        <ToggleSwitch
          checked={settings.notifications.newPlays}
          onChange={() => handleNotificationChange('newPlays')}
          label="Nuevas reproducciones"
        />
        <ToggleSwitch
          checked={settings.notifications.comments}
          onChange={() => handleNotificationChange('comments')}
          label="Comentarios en mis canciones"
        />
      </SettingsSection>

      {/* Privacy */}
      <SettingsSection title="Privacidad" icon={<Lock size={20} />}>
        <ToggleSwitch
          checked={settings.privacy.profilePublic}
          onChange={() => handlePrivacyChange('profilePublic')}
          label="Perfil público"
        />
        <ToggleSwitch
          checked={settings.privacy.showEmail}
          onChange={() => handlePrivacyChange('showEmail')}
          label="Mostrar correo electrónico"
        />
        <ToggleSwitch
          checked={settings.privacy.showLocation}
          onChange={() => handlePrivacyChange('showLocation')}
          label="Mostrar ubicación"
        />
        <ToggleSwitch
          checked={settings.privacy.allowMessages}
          onChange={() => handlePrivacyChange('allowMessages')}
          label="Permitir mensajes de fans"
        />
      </SettingsSection>

      {/* Preferences */}
      <SettingsSection title="Preferencias" icon={<Globe size={20} />}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 0',
          borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
        }}>
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '500',
              color: isDark ? '#fff' : '#111',
              marginBottom: '4px'
            }}>
              Idioma
            </div>
          </div>
          <select
            value={settings.preferences.language}
            onChange={(e) => handlePreferenceChange('language', e.target.value)}
            style={{
              padding: '8px 12px',
              background: isDark ? '#111' : '#f9fafb',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: isDark ? '#fff' : '#111',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="pt">Português</option>
          </select>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 0',
          borderBottom: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`
        }}>
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '500',
              color: isDark ? '#fff' : '#111',
              marginBottom: '4px'
            }}>
              Moneda
            </div>
          </div>
          <select
            value={settings.preferences.currency}
            onChange={(e) => handlePreferenceChange('currency', e.target.value)}
            style={{
              padding: '8px 12px',
              background: isDark ? '#111' : '#f9fafb',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: isDark ? '#fff' : '#111',
              fontSize: '14px',
              cursor: 'pointer'
            }}
          >
            <option value="MXN">MXN - Peso Mexicano</option>
            <option value="USD">USD - Dólar Americano</option>
            <option value="EUR">EUR - Euro</option>
          </select>
        </div>

        <ToggleSwitch
          checked={settings.preferences.autoPlay}
          onChange={() => handlePreferenceChange('autoPlay', !settings.preferences.autoPlay)}
          label="Reproducción automática"
        />
        <ToggleSwitch
          checked={settings.preferences.highQuality}
          onChange={() => handlePreferenceChange('highQuality', !settings.preferences.highQuality)}
          label="Calidad de audio alta"
        />
      </SettingsSection>

      {/* Help */}
      <SettingsSection title="Ayuda y Soporte" icon={<HelpCircle size={20} />}>
        <div style={{ fontSize: '14px', color: isDark ? '#9ca3af' : '#6b7280' }}>
          <p style={{ marginBottom: '16px' }}>
            ¿Necesitas ayuda? Estamos aquí para asistirte.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button style={{
              padding: '12px 16px',
              background: 'none',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: isDark ? '#fff' : '#111',
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left'
            }}>
              Centro de Ayuda
            </button>
            <button style={{
              padding: '12px 16px',
              background: 'none',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: isDark ? '#fff' : '#111',
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left'
            }}>
              Contactar Soporte
            </button>
            <button style={{
              padding: '12px 16px',
              background: 'none',
              border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`,
              borderRadius: '8px',
              color: isDark ? '#fff' : '#111',
              fontSize: '14px',
              cursor: 'pointer',
              textAlign: 'left'
            }}>
              Reportar un Problema
            </button>
          </div>
        </div>
      </SettingsSection>
    </div>
  )
}

export default SettingsPage
