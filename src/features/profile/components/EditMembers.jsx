import { useState, useEffect } from 'react'
import { useThemeStore, useAuthStore } from '../../../app/store'
import { onboardingService } from '../../../services/api'

export const EditMembers = () => {
  const { theme } = useThemeStore()
  const { user } = useAuthStore()
  const isDark = theme === 'dark'

  // Estados
  const [members, setMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false) // Estado para el botón de guardar

  // 1. PASO 1: CARGAR LOS MIEMBROS AL ENTRAR A LA PÁGINA
  const fetchMembers = async () => {
    if (!user?.id) return
    try {
      setIsLoading(true)
      // Usamos el servicio de obtener (GET), NO el de actualizar
      const artistMembers = await onboardingService.getBandMembers(user.id)        
      setMembers(Array.isArray(artistMembers) ? artistMembers : [])
    } catch (err) {
      console.error('Error fetching members:', err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [user?.id])


  // 2. PASO 2: FUNCIÓN PARA ACTUALIZAR LOS DATOS (Se ejecuta al hacer clic)
  const handleUpdateMember = async (memberId, updatedData) => {
    try {
      setIsUpdating(true)
      
      // Enviamos el ID del miembro y sus nuevos datos (ej: { name: 'Nuevo Nombre', role: 'Guitar' })
      await onboardingService.updateBandMember(memberId, updatedData)
      
      alert('✅ Miembro actualizado con éxito')
      
      // Refrescamos la lista para ver los cambios reflejados
      await fetchMembers()
    } catch (err) {
      console.error('Error updating member:', err)
      alert('❌ Error al actualizar el miembro')
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <div style={{ padding: '20px', color: isDark ? '#fff' : '#111' }}>
      <h3>Editar Miembros</h3>
      
      {isLoading ? (
        <p>Cargando lista...</p>
      ) : (
        <div>
          {members.map((member) => (
            <div key={member.id} style={{ marginBottom: '16px', padding: '12px', border: '1px solid #374151', borderRadius: '8px' }}>
              
              {/* Ejemplo básico de Inputs para editar los datos localmente en la lista */}
              <input 
                type="text" 
                value={member.name} 
                onChange={(e) => {
                  // Actualizar estado local antes de enviar a la API
                  setMembers(members.map(m => m.id === member.id ? { ...m, name: e.target.value } : m))
                }}
                style={{ marginRight: '8px', padding: '6px' }}
              />

              <input 
                type="text" 
                value={member.role} 
                onChange={(e) => {
                  setMembers(members.map(m => m.id === member.id ? { ...m, role: e.target.value } : m))
                }}
                style={{ marginRight: '8px', padding: '6px' }}
              />

              {/* Botón que dispara la actualización en la Base de Datos */}
              <button 
                onClick={() => handleUpdateMember(member.id, { name: member.name, role: member.role })}
                disabled={isUpdating}
                style={{ padding: '6px 12px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                {isUpdating ? 'Guardando...' : 'Actualizar'}
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}