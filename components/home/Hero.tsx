'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/axios'
import styles from './Hero.module.css'

export default function Hero() {
  const [portadas, setPortadas] = useState<any[]>([])
  const [currentPortadaIndex, setCurrentPortadaIndex] = useState(0)
  const [institucionData, setInstitucionData] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '45'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        
        const contenidoRes = await apiClient.get(`/institucion/${id}/contenido`)
        const portadasData = contenidoRes.data?.portada || []
        
        if (portadasData.length > 0) {
          setPortadas(portadasData.map((p: any) => ({
            ...p,
            portada_imagen: p.portada_imagen.startsWith('http') 
              ? p.portada_imagen 
              : `${baseUrl}${p.portada_imagen}`
          })))
        }

        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        setInstitucionData(principalRes.data?.Descripcion)
        setTimeout(() => setIsLoaded(true), 100)
      } catch (error) {
        console.warn('Error cargando datos del Hero')
        setIsLoaded(true)
      }
    }
    fetchData()
  }, [])

  // Auto-rotate portadas
  useEffect(() => {
    if (portadas.length <= 1) return
    const interval = setInterval(() => {
      setCurrentPortadaIndex((prev) => (prev + 1) % portadas.length)
    }, 7000)
    return () => clearInterval(interval)
  }, [portadas])

  const colores = institucionData?.colorinstitucion?.[0]
  const colorPrimario = colores?.color_primario || '#6366f1'
  const colorSecundario = colores?.color_secundario || '#14b8a6'
  const nombreCarrera = institucionData?.institucion_nombre || 'Psicomotricidad y Deportes'
  
  const misionLimpia = institucionData?.institucion_mision
    ? institucionData.institucion_mision.replace(/<[^>]*>/g, '').slice(0, 200) + '...'
    : 'Desarrollo integral del movimiento humano para potenciar las capacidades físicas, cognitivas y emocionales.'

  return (
  <section 
    className={`${styles.hero} ${isLoaded ? styles.loaded : ''}`}
    style={{
      '--color-primario': colorPrimario,
      '--color-secundario': colorSecundario,
    } as React.CSSProperties}
  >
    {/* Fondo con portadas */}
    <div className={styles.background}>
      {portadas.map((portada, index) => (
        <div
          key={portada.portada_id || index}
          className={`${styles.portada} ${index === currentPortadaIndex ? styles.active : ''}`}
        >
          <img
            src={portada.portada_imagen}
            alt={portada.portada_titulo || 'Portada'}
            className={styles.portadaImage}
          />
        </div>
      ))}
      {/* Overlay oscuro para máximo contraste */}
      <div className={styles.overlay} />
      
      {/* Líneas de velocidad decorativas */}
      <div className={styles.speedLines}>
        <div className={styles.speedLine} style={{ top: '20%', width: '200px', animationDelay: '0s' }} />
        <div className={styles.speedLine} style={{ top: '50%', width: '150px', animationDelay: '1s' }} />
        <div className={styles.speedLine} style={{ top: '80%', width: '180px', animationDelay: '2s' }} />
      </div>
    </div>

    {/* Logo Marca de Agua */}
    <div className={styles.watermarkLogo}>
      <img 
        src="logoupea.jpg"
        alt="UPEA Watermark" 
        className={styles.watermarkImage}
        onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
      />
    </div>

    {/* Contenido Principal */}
    <div className={styles.content}>
      {/* Badge */}
      <div className={styles.badge}>
        <img 
          src="logoupea.jpg"
          alt="UPEA" 
          className={styles.badgeLogo}
          onError={(e) => (e.target as HTMLImageElement).style.display = 'none'}
        />
        <div className={styles.badgeText}>
          <span className={styles.badgeTitle}>Universidad Pública de El Alto</span>
          <span className={styles.badgeSubtitle}>La Universidad del pueblo</span>
        </div>
      </div>

      {/* Título con Entrada de Patada */}
      <div className={styles.titleContainer}>
        <h1 className={styles.mainTitle}>
          <span className={styles.titlePre}>Carrera de</span>
          <span 
            className={styles.titleHighlight}
            style={{
              backgroundImage: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario}, ${colorPrimario})`
            }}
          >
            {nombreCarrera}
          </span>
        </h1>
        {/* Efecto de impacto */}
        <div className={styles.impactEffect} />
      </div>

      {/* Descripción */}
      <div className={styles.descriptionContainer}>
        <p className={styles.description}>
          {misionLimpia}
        </p>
      </div>
    </div>

    {/* Indicadores */}
    {portadas.length > 1 && (
      <div className={styles.indicators}>
        {portadas.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentPortadaIndex(index)}
            className={`${styles.indicator} ${index === currentPortadaIndex ? styles.active : ''}`}
            aria-label={`Portada ${index + 1}`}
          />
        ))}
      </div>
    )}
  </section>
)
}