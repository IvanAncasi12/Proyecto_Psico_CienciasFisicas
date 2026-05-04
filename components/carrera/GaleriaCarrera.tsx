'use client'

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios'

type Portada = {
  portada_id?: number | string
  portada_titulo?: string
  portada_descripcion?: string
  portada_imagen: string
}

export default function GaleriaCarrera() {
  const [portadas, setPortadas] = useState<Portada[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchPortadas = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '45'
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          'https://apiadministrador.upea.bo'

        const res = await apiClient.get(`/institucion/${id}/contenido`)
        const portadasData = res.data?.portada || []

        const portadasFormateadas = portadasData
          .filter((p: any) => p?.portada_imagen)
          .map((p: any) => ({
            ...p,
            portada_imagen: p.portada_imagen.startsWith('http')
              ? p.portada_imagen
              : `${baseUrl}${p.portada_imagen}`,
          }))

        setPortadas(portadasFormateadas)
      } catch (error) {
        console.warn('Error cargando portadas para la galería', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPortadas()
  }, [])

  useEffect(() => {
    if (!isAutoPlaying || portadas.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % portadas.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [portadas.length, isAutoPlaying])

  const pauseAutoPlay = () => {
    setIsAutoPlaying(false)

    setTimeout(() => {
      setIsAutoPlaying(true)
    }, 10000)
  }

  const prevImage = () => {
    if (portadas.length === 0) return

    pauseAutoPlay()
    setCurrentIndex((prev) => (prev - 1 + portadas.length) % portadas.length)
  }

  const nextImage = () => {
    if (portadas.length === 0) return

    pauseAutoPlay()
    setCurrentIndex((prev) => (prev + 1) % portadas.length)
  }

  const goToImage = (index: number) => {
    pauseAutoPlay()
    setCurrentIndex(index)
  }

  if (isLoading) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 font-bold text-sm">
            Galería institucional
          </span>

          <h3 className="text-3xl md:text-4xl font-black text-gray-900 mt-4 mb-3">
            Nuestra Institución en Imágenes
          </h3>

          <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-blue-600 mx-auto rounded-full" />
        </div>

        <div className="h-96 md:h-[500px] rounded-[2rem] bg-gray-200 animate-pulse" />
      </section>
    )
  }

  if (portadas.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 font-bold text-sm">
            Galería institucional
          </span>

          <h3 className="text-3xl md:text-4xl font-black text-gray-900 mt-4 mb-3">
            Nuestra Institución en Imágenes
          </h3>

          <div className="w-20 h-1 bg-gradient-to-r from-red-600 to-blue-600 mx-auto rounded-full" />
        </div>

        <div className="h-96 md:h-[500px] rounded-[2rem] bg-gradient-to-br from-gray-200 to-gray-300 flex flex-col items-center justify-center text-gray-600">
          <span className="text-6xl mb-4">🖼️</span>
          <p className="text-xl font-black">No hay portadas disponibles</p>
          <p className="text-sm mt-2 text-gray-500">
            Cuando se agreguen portadas, aparecerán aquí automáticamente.
          </p>
        </div>
      </section>
    )
  }

  const portadaActual = portadas[currentIndex]

  return (
    <section className="max-w-7xl mx-auto px-4 py-14">
      <div className="text-center mb-10">
        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-600 font-black text-sm tracking-wide">
          Galería institucional
        </span>

        <h3 className="text-3xl md:text-5xl font-black text-gray-900 mt-4 mb-3">
          Nuestra Institución en Imágenes
        </h3>

        <p className="max-w-2xl mx-auto text-gray-500 font-semibold">
          Conoce nuestras actividades, eventos y momentos destacados a través de
          nuestras portadas institucionales.
        </p>

        <div className="w-24 h-1 bg-gradient-to-r from-red-600 via-yellow-400 to-blue-600 mx-auto rounded-full mt-5" />
      </div>

      <div
        className="relative overflow-hidden rounded-[2rem] shadow-[0_30px_90px_rgba(15,23,42,0.28)] bg-gray-900 group"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div
          className="flex transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {portadas.map((portada, i) => (
            <div key={portada.portada_id || i} className="w-full flex-shrink-0">
              <div className="relative h-96 md:h-[540px]">
                <img
                  src={portada.portada_imagen}
                  alt={portada.portada_titulo || `Portada ${i + 1}`}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/45 via-transparent to-black/20" />

                <div className="absolute left-6 md:left-10 bottom-8 md:bottom-10 max-w-2xl text-white">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-xs md:text-sm font-black mb-4 border border-white/20">
                    Portada {i + 1} de {portadas.length}
                  </span>

                  <h4 className="text-2xl md:text-4xl font-black leading-tight drop-shadow-lg">
                    {portada.portada_titulo || 'Imagen institucional'}
                  </h4>

                  {portada.portada_descripcion && (
                    <p className="mt-3 text-sm md:text-base text-white/85 font-semibold line-clamp-2">
                      {portada.portada_descripcion.replace(/<[^>]*>/g, '')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {portadas.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 opacity-90 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Imagen anterior"
            >
              <svg
                className="w-6 h-6 text-gray-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.4}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>

            <button
              onClick={nextImage}
              className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 bg-white/90 hover:bg-white rounded-full flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 opacity-90 md:opacity-0 md:group-hover:opacity-100"
              aria-label="Siguiente imagen"
            >
              <svg
                className="w-6 h-6 text-gray-900"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.4}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 px-4 py-2 rounded-full bg-black/35 backdrop-blur-md border border-white/10">
              {portadas.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToImage(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    i === currentIndex
                      ? 'w-9 bg-white'
                      : 'w-2.5 bg-white/45 hover:bg-white/80'
                  }`}
                  aria-label={`Ir a portada ${i + 1}`}
                />
              ))}
            </div>

            <div className="absolute top-5 right-5 bg-black/45 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-black border border-white/10">
              {currentIndex + 1} / {portadas.length}
            </div>

            <div
              key={currentIndex}
              className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-red-600 via-yellow-400 to-blue-600"
              style={{
                animation: isAutoPlaying ? 'progress 4s linear forwards' : 'none',
              }}
            />
          </>
        )}
      </div>

      {portadas.length > 1 && (
        <div className="flex justify-center gap-3 mt-7 overflow-x-auto pb-3 px-1">
          {portadas.map((portada, i) => (
            <button
              key={portada.portada_id || i}
              onClick={() => goToImage(i)}
              className={`relative flex-shrink-0 w-24 h-16 md:w-28 md:h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                i === currentIndex
                  ? 'border-red-600 scale-105 shadow-lg'
                  : 'border-gray-200 hover:border-gray-400 opacity-75 hover:opacity-100'
              }`}
              aria-label={`Seleccionar portada ${i + 1}`}
            >
              <img
                src={portada.portada_imagen}
                alt={`Miniatura ${i + 1}`}
                className="w-full h-full object-cover"
              />

              <div
                className={`absolute inset-0 transition-all duration-300 ${
                  i === currentIndex ? 'bg-black/0' : 'bg-black/25'
                }`}
              />
            </button>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes progress {
          from {
            width: 0%;
          }

          to {
            width: 100%;
          }
        }
      `}</style>
    </section>
  )
}