'use client'

import { useEffect, useState, type CSSProperties } from 'react'
import { apiClient } from '@/lib/axios'
import styles from './Hero.module.css'

export default function Hero() {
  const baseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'

  const [portadas, setPortadas] = useState<any[]>([])
  const [currentPortadaIndex, setCurrentPortadaIndex] = useState(0)
  const [institucionData, setInstitucionData] = useState<any>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '45'

        const contenidoRes = await apiClient.get(`/institucion/${id}/contenido`)
        const portadasData = contenidoRes.data?.portada || []

        if (portadasData.length > 0) {
          setPortadas(
            portadasData.map((p: any) => ({
              ...p,
              portada_imagen: p.portada_imagen?.startsWith('http')
                ? p.portada_imagen
                : `${baseUrl}${p.portada_imagen}`,
            }))
          )
        }

        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        setInstitucionData(principalRes.data?.Descripcion)

        setTimeout(() => setIsLoaded(true), 100)
      } catch (error) {
        console.warn('Error cargando datos del Hero', error)
        setIsLoaded(true)
      }
    }

    fetchData()
  }, [baseUrl])

  useEffect(() => {
    if (portadas.length <= 1) return

    const interval = setInterval(() => {
      setCurrentPortadaIndex((prev) => (prev + 1) % portadas.length)
    }, 7000)

    return () => clearInterval(interval)
  }, [portadas])

  const colores = institucionData?.colorinstitucion?.[0]

  const colorPrimario = colores?.color_primario || '#dc2626'
  const colorSecundario = colores?.color_secundario || '#2563eb'

  const nombreCarrera =
    institucionData?.institucion_nombre || 'Psicomotricidad y Deportes'

  const logoServicioRaw =
    institucionData?.institucion_logo ||
    institucionData?.institucion_imagen ||
    institucionData?.institucion_logo_url ||
    institucionData?.institucion_escudo ||
    ''

  const logoServicio = logoServicioRaw
    ? logoServicioRaw.startsWith('http')
      ? logoServicioRaw
      : `${baseUrl}${logoServicioRaw}`
    : '/logoupea.jpg'

  return (
    <section
      className={`${styles.hero} ${isLoaded ? styles.loaded : ''}`}
      style={
        {
          '--color-primario': colorPrimario,
          '--color-secundario': colorSecundario,
        } as CSSProperties
      }
    >
      <div className={styles.background}>
        {portadas.map((portada, index) => (
          <div
            key={portada.portada_id || index}
            className={`${styles.portada} ${
              index === currentPortadaIndex ? styles.active : ''
            }`}
          >
            <img
              src={portada.portada_imagen}
              alt={portada.portada_titulo || 'Portada'}
              className={styles.portadaImage}
            />
          </div>
        ))}

        <div className={styles.overlay} />

        <div className={styles.speedLines}>
          <div className={styles.speedLine} />
          <div className={styles.speedLine} />
          <div className={styles.speedLine} />
          <div className={styles.speedLine} />
          <div className={styles.speedLine} />
          <div className={styles.speedLine} />
        </div>
      </div>

      <div className={styles.watermarkLogo}>
        <div className={styles.logoAura}></div>
        <img
          src={logoServicio}
          alt={`Logo ${nombreCarrera}`}
          className={styles.watermarkImage}
          onError={(e) => {
            ;(e.target as HTMLImageElement).style.display = 'none'
          }}
        />
      </div>

      <div className={styles.content}>
        <div className={styles.titleContainer}>
          <div className={styles.titleLight}></div>

          <h1 className={styles.mainTitle}>
            <span className={styles.titlePre}>Carrera de</span>

            <span
              className={styles.titleHighlight}
              style={{
                backgroundImage: `linear-gradient(135deg, #ffffff 0%, #fda4af 18%, ${colorPrimario} 52%, ${colorSecundario} 100%)`,
              }}
            >
              {nombreCarrera}
            </span>
          </h1>
        </div>
      </div>

      {portadas.length > 1 && (
        <div className={styles.indicators}>
          {portadas.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPortadaIndex(index)}
              className={`${styles.indicator} ${
                index === currentPortadaIndex ? styles.active : ''
              }`}
              aria-label={`Portada ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  )
}