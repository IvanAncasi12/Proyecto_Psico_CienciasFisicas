'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'
import PortadaSeccion from '@/components/carrera/PortadaSeccion'

export default function EnlacesPage() {
  const [enlaces, setEnlaces] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [colores, setColores] = useState({ primario: '#DC0E10', secundario: '#E9C202' })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '45'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        
        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        const cols = principalRes.data?.Descripcion?.colorinstitucion?.[0]
        if (cols) {
          setColores({
            primario: cols.color_primario || '#DC0E10',
            secundario: cols.color_secundario || '#E9C202'
          })
        }
        
        const res = await apiClient.get(`/institucion/${id}/recursos`)
        const linksRaw = res.data?.linksExternoInterno || []
        const linksActivos = linksRaw.filter((l: any) => l.estado === 1)
        
        const formatted = linksActivos.map((l: any) => {
          let img_url = ''
          if (l.imagen) {
            img_url = l.imagen.startsWith('http') ? l.imagen : `${baseUrl}${l.imagen}`
          }
          return { id: l.id_link, nombre: l.nombre, url: l.url_link || '#', tipo: l.tipo, img_url }
        })
      
        if (formatted.length === 0) {
          setEnlaces([
            { id: 1, nombre: 'Campus Virtual', url: 'https://virtualeconomia.upea.bo/', tipo: 'CAMPUS', img_url: '', descripcion: 'Plataforma de aprendizaje virtual' },
            { id: 2, nombre: 'Inscripciones', url: 'https://inscripcioneseconomia.upea.bo/', tipo: 'INSCRIPCIONES', img_url: '', descripcion: 'Sistema de inscripciones en línea' },
            { id: 3, nombre: 'Página Web', url: 'https://economia.upea.edu.bo/', tipo: 'WEB', img_url: '', descripcion: 'Sitio web oficial de la carrera' },
          ])
        } else {
          setEnlaces(formatted)
        }
      } catch (e) { console.error('Error cargando enlaces:', e) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])

  const getIconByType = (tipo: string) => {
    const icons: Record<string, string> = {
      'CAMPUS': '🎓', 'INSCRIPCIONES': '📝', 'WEB': '🌐',
      'BIBLIOTECA': '📚', 'PLATAFORMA': '💻', 'RECURSOS': '📦', 'DEFAULT': '🔗'
    }
    return icons[tipo?.toUpperCase()] || icons.DEFAULT
  }

  return (
    <>
      <PortadaSeccion titulo="Enlaces de Interés" subtitulo="Recursos y plataformas útiles" />
      
      <div className="py-12 bg-gradient-to-b from-gray-50 to-white min-h-screen">
        <div className="max-w-6xl mx-auto px-4">
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-red-600"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {enlaces.map((link: any, index: number) => (
                <a
                  key={link.id || link.nombre}
                  href={link.url || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="enlace-card group relative bg-white rounded-3xl p-8 border-2 border-gray-100 hover:border-[var(--link-primary)] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2"
                  style={{ 
                    '--link-primary': colores.primario, 
                    '--link-secondary': colores.secundario,
                    animationDelay: `${index * 0.1}s` 
                  } as React.CSSProperties}
                >
                  {/* Icono grande */}
                  <div 
                    className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-6 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 shadow-lg"
                    style={{ background: `linear-gradient(135deg, ${colores.primario}20, ${colores.secundario}20)` }}
                  >
                    {link.img_url ? (
                      <img src={link.img_url} alt={link.nombre} className="w-14 h-14 object-contain"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).parentElement!.innerHTML = getIconByType(link.tipo) }} />
                    ) : (
                      <span className="enlace-icon">{getIconByType(link.tipo)}</span>
                    )}
                  </div>
                  
                  {/* Título grande */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-[var(--link-primary)] transition-colors">
                    {link.nombre}
                  </h3>
                  
                  {/* Badge de tipo */}
                  {link.tipo && (
                    <span className="inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-3"
                      style={{ 
                        background: `linear-gradient(135deg, ${colores.primario}, ${colores.secundario})`, 
                        color: 'white',
                        boxShadow: `0 4px 15px ${colores.primario}40`
                      }}>
                      {link.tipo}
                    </span>
                  )}
                  
                  {/* Descripción */}
                  {link.descripcion && (
                    <p className="text-gray-600 mb-4 text-base">{link.descripcion}</p>
                  )}
                  
                  <p className="text-gray-500 text-sm mb-4">Visitar sitio externo</p>
                  
                  {/* Botón de acción grande */}
                  <div 
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all duration-300 group-hover:shadow-lg group-hover:scale-105"
                    style={{ background: `linear-gradient(135deg, ${colores.primario}, ${colores.secundario})` }}
                  >
                    <span>Abrir enlace</span>
                    <span className="transition-transform group-hover:translate-x-2 text-xl">→</span>
                  </div>
                  
                  {/* Línea decorativa inferior */}
                  <div className="enlace-accent absolute bottom-0 left-0 right-0 h-2 rounded-b-3xl" 
                    style={{ background: `linear-gradient(90deg, ${colores.primario}, ${colores.secundario})` }} />
                </a>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}