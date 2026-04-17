'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/axios'

export default function Footer() {
  const [footerData, setFooterData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '45'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        const data = principalRes.data?.Descripcion
        const socialLinks = {
          facebook: data?.institucion_facebook !== '_' ? data?.institucion_facebook : null,
          youtube: data?.institucion_youtube !== '_' ? data?.institucion_youtube : null,
          twitter: data?.institucion_twitter !== '_' ? data?.institucion_twitter : null,
        }

        setFooterData({ ...data, socialLinks, baseUrl })
      } catch (error) {
        console.warn('⚠️ Error cargando datos del footer')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const colores = footerData?.colorinstitucion?.[0]
  const colorPrimario = colores?.color_primario || '#6366f1'
  const colorSecundario = colores?.color_secundario || '#14b8a6'
  const nombreCarrera = footerData?.institucion_nombre || 'Psicomotricidad'

  return (
    <footer 
      className="relative overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${colorPrimario} 0%, ${colorPrimario}dd 50%, ${colorSecundario} 100%)`,
      }}
    >
      {/* Formas decorativas animadas */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute -top-40 -right-40 w-80 h-80 rounded-full opacity-20 animate-pulse"
          style={{ background: `radial-gradient(circle, ${colorSecundario}, transparent)` }}
        />
        <div 
          className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full opacity-20 animate-pulse"
          style={{ background: `radial-gradient(circle, ${colorSecundario}, transparent)`, animationDelay: '1s' }}
        />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
      </div>

      {/* Línea superior brillante */}
      <div className="absolute top-0 left-0 right-0 h-2"
        style={{
          background: `linear-gradient(90deg, transparent, ${colorSecundario}, ${colorPrimario}, ${colorSecundario}, transparent)`,
          boxShadow: `0 0 30px ${colorSecundario}`
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Header del Footer */}
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl mb-6 backdrop-blur-sm"
            style={{ background: 'rgba(255,255,255,0.15)', border: '2px solid rgba(255,255,255,0.3)' }}
          >
            <span className="text-4xl">🎓</span>
            <div className="text-left">
              <h3 className="text-2xl font-black text-white">Carrera de {nombreCarrera}</h3>
              <p className="text-white/90 font-semibold text-sm">Universidad Pública de El Alto</p>
            </div>
          </div>
        </div>

        {/* Grid Principal */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Columna 1: Info */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">📚</span>
                Sobre Nosotros
              </h4>
              <p className="text-white/90 text-sm leading-relaxed mb-4">
                {footerData?.institucion_mision 
                  ? footerData.institucion_mision.replace(/<[^>]*>/g, '').slice(0, 120) + '...'
                  : 'Formando profesionales con excelencia académica.'}
              </p>
              
              {/* Redes Sociales */}
              {!loading && footerData?.socialLinks && (
                <div className="flex gap-3">
                  {footerData.socialLinks.facebook && (
                    <a href={footerData.socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-all hover:scale-110 hover:rotate-12">
                      <span className="text-lg">📘</span>
                    </a>
                  )}
                  {footerData.socialLinks.youtube && (
                    <a href={footerData.socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-all hover:scale-110 hover:rotate-12">
                      <span className="text-lg">📺</span>
                    </a>
                  )}
                  {footerData.socialLinks.twitter && (
                    <a href={footerData.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                      className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/40 transition-all hover:scale-110 hover:rotate-12">
                      <span className="text-lg">🐦</span>
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Columna 2: Enlaces */}
          <div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">🔗</span>
                Enlaces Rápidos
              </h4>
              <ul className="space-y-2">
                {['Inicio', 'Nosotros', 'Ofertas', 'Autoridades', 'Contacto'].map((item, i) => (
                  <li key={item}>
                    <Link href={['/', '/carrera/nosotros', '/academico/ofertas-academicas', '/carrera/autoridades', '/contacto'][i]}
                      className="text-white/90 hover:text-white transition-colors flex items-center gap-2 text-sm group">
                      <span className="w-2 h-2 rounded-full bg-white/60 group-hover:bg-white group-hover:scale-150 transition-all" />
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Columna 3: Recursos */}
          <div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">📖</span>
                Recursos
              </h4>
              <ul className="space-y-2">
                {[
                  { label: 'Campus Virtual', url: 'https://virtualeconomia.upea.bo/' },
                  { label: 'Inscripciones', url: 'https://inscripcioneseconomia.upea.bo/' },
                  { label: 'Biblioteca', url: '#' },
                  { label: 'Cursos', url: '#' },
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.url} target="_blank" rel="noopener noreferrer"
                      className="text-white/90 hover:text-white transition-colors flex items-center gap-2 text-sm group">
                      <span className="w-2 h-2 rounded-full bg-white/60 group-hover:bg-white group-hover:scale-150 transition-all" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Columna 4: Contacto */}
          <div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <h4 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                <span className="text-2xl">📞</span>
                Contacto
              </h4>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-3 items-start">
                  <span className="text-2xl">📍</span>
                  <p className="text-white/90">{footerData?.institucion_direccion || 'Campus UPEA, El Alto'}</p>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="text-2xl">📱</span>
                  <span className="text-white/90">{footerData?.institucion_celular1 || '+591 2 1234567'}</span>
                </li>
                <li className="flex gap-3 items-center">
                  <span className="text-2xl">✉️</span>
                  <a href={`mailto:${footerData?.institucion_correo1}`} className="text-white/90 hover:text-white transition-colors">
                    {footerData?.institucion_correo1 || 'info@upea.bo'}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/80 text-sm text-center md:text-left">
              &copy; {new Date().getFullYear()} UPEA - Carrera de {nombreCarrera}. Todos los derechos reservados.
            </p>
            
            <div className="flex gap-6 text-sm">
              <Link href="#" className="text-white/80 hover:text-white transition-colors">Privacidad</Link>
              <Link href="#" className="text-white/80 hover:text-white transition-colors">Términos</Link>
            </div>
          </div>
          
          {/* Developer Credit */}
          <div className="mt-6 text-center">
            <a
              href="https://www.linkedin.com/in/ivan-ancasi-tumiri-a58764393"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/15 hover:bg-white/25 backdrop-blur-sm border border-white/30 transition-all hover:scale-110 group"
            >
              <span className="font-bold text-white group-hover:text-yellow-300 transition-colors">I.A.T.</span>
              <span className="text-white/80 group-hover:text-white transition-colors">Desarrollador</span>
              <svg className="w-4 h-4 text-white/60 group-hover:text-white group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}