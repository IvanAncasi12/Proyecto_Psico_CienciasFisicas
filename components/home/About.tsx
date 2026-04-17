'use client'

import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/axios'
import styles from './About.module.css'

export default function About() {
  const [mision, setMision] = useState('')
  const [vision, setVision] = useState('')
  const [video, setVideo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [institucionData, setInstitucionData] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '45'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        const principalRes = await apiClient.get(`/institucionesPrincipal/${id}`)
        const data = principalRes.data?.Descripcion
        setInstitucionData(data)
        
        if (data) {
          setMision(data.institucion_mision || '')
          setVision(data.institucion_vision || '')
        }

        const contenidoRes = await apiClient.get(`/institucion/${id}/contenido`)
        const videos = contenidoRes.data?.upea_videos || []
        if (videos.length > 0) {
          setVideo(videos[0])
        }
      } catch (error) {
        console.warn('Error cargando datos del About')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const colores = institucionData?.colorinstitucion?.[0]
  const colorPrimario = colores?.color_primario || '#6366f1'
  const colorSecundario = colores?.color_secundario || '#14b8a6'

  return (
    <section id="acerca" className={styles.about}>
      <div className={styles.container}>
        
        {/* Header */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>
            NUESTRA <span style={{ color: colorPrimario }}>CARRERA</span>
          </h2>
          <div className={styles.divider} style={{ backgroundColor: colorSecundario }} />
        </div>

        <div className={styles.cardsGrid}>
          {/* Misión */}
          <div className={styles.card} style={{ borderTopColor: colorPrimario }}>
            <div className={styles.cardIcon} style={{ backgroundColor: colorPrimario }}>
            </div>
            <h3 className={styles.cardTitle}>Misión</h3>
            <div className={styles.cardContent}>
              <div dangerouslySetInnerHTML={{ __html: mision || '<p>Cargando...</p>' }} />
            </div>
          </div>

          {/* Visión */}
          <div className={styles.card} style={{ borderTopColor: colorSecundario }}>
            <div className={styles.cardIcon} style={{ backgroundColor: colorSecundario }}>
            </div>
            <h3 className={styles.cardTitle}>Visión</h3>
            <div className={styles.cardContent}>
              <div dangerouslySetInnerHTML={{ __html: vision || '<p>Cargando...</p>' }} />
            </div> 
          </div>
        </div>

        {/* Video */}
        <div className={styles.videoSection}>
          <div className={styles.videoHeader}>
            <h3 className={styles.videoTitle}>CONOCE LA CARRERA</h3>
            <div className={styles.videoDivider} style={{ backgroundColor: colorPrimario }} />
          </div>
          
          <div className={styles.videoContainer}>
            {video ? (
              <iframe
                src={video.video_enlace || video.video_url}
                title={video.video_titulo || 'Video Institucional'}
                className={styles.videoIframe}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className={styles.videoPlaceholder}>
                <div className={styles.placeholderIcon}>🎥</div>
                <p>Video institucional próximamente</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div 
              className={styles.statNumber}
              style={{
                backgroundImage: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              25+
            </div>
            <p className={styles.statLabel}>Años de Trayectoria</p>
            <p className={styles.statDescription}>Formando profesionales desde 1998</p>
          </div>

          <div className={styles.statCard}>
            <div 
              className={styles.statNumber}
              style={{
                backgroundImage: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              3,500+
            </div>
            <p className={styles.statLabel}>Egresados Exitosos</p>
            <p className={styles.statDescription}>Líderes en el ámbito profesional</p>
          </div>

          <div className={styles.statCard}>
            <div 
              className={styles.statNumber}
              style={{
                backgroundImage: `linear-gradient(135deg, ${colorPrimario}, ${colorSecundario})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              1,200+
            </div>
            <p className={styles.statLabel}>Estudiantes Activos</p>
            <p className={styles.statDescription}>Formándose actualmente</p>
          </div>
        </div>

      </div>
    </section>
  )
}