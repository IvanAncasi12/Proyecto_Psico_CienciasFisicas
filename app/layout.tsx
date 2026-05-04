// app/layout.tsx
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

type CarreraData = {
  nombre: string
  logoUrl: string
  descripcion: string
}

const INSTITUCION_ID = process.env.NEXT_PUBLIC_INSTITUCION_ID || '25'
const API_PUBLICA = 'https://serviciopagina.upea.bo'

function limpiarTexto(texto?: string | null) {
  if (!texto) return ''

  return String(texto)
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function construirLogoUrl(logo?: string | null) {
  if (!logo) return ''

  const logoLimpio = String(logo).trim()

  if (!logoLimpio) return ''

  if (logoLimpio.startsWith('http')) {
    return logoLimpio
  }

  /*
    La API pública devuelve solo el nombre del archivo:
    ejemplo: 82451bca-056b-4869-967b-5bd449327146.png

    Para logos de institución/carrera se usa el directorio InstitucionUpea.
  */
  return `${API_PUBLICA}/InstitucionUpea/${logoLimpio}`
}

async function getCarreraData(): Promise<CarreraData> {
  try {
    const res = await fetch(`${API_PUBLICA}/api/carrerasAll`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      cache: 'no-store',
      next: {
        revalidate: 0,
      },
    })

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`)
    }

    const carreras = await res.json()

    const carrera = Array.isArray(carreras)
      ? carreras.find(
          (item: any) => String(item?.institucion_id) === String(INSTITUCION_ID)
        )
      : null

    if (!carrera) {
      throw new Error(`No se encontró la institución ${INSTITUCION_ID}`)
    }

    const nombre =
      limpiarTexto(carrera?.carrera) ||
      limpiarTexto(carrera?.nombre_simple) ||
      'PSICOMOTRICIDAD Y DEPORTES'

    const logoUrl = construirLogoUrl(carrera?.institucion_logo)

    const descripcion = `${nombre} - Universidad Pública de El Alto`


    return {
      nombre,
      logoUrl,
      descripcion,
    }
  } catch (error) {
    console.warn('No se pudo cargar metadata desde carrerasAll:', error)

    return {
      nombre: 'PSICOMOTRICIDAD Y DEPORTES',
      logoUrl: '',
      descripcion:
        'PSICOMOTRICIDAD Y DEPORTES - Universidad Pública de El Alto',
    }
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { nombre, logoUrl, descripcion } = await getCarreraData()

  return {
    title: nombre,
    description: descripcion,

    icons: logoUrl
      ? {
          icon: [
            {
              url: logoUrl,
              type: 'image/png',
            },
          ],
          shortcut: [
            {
              url: logoUrl,
              type: 'image/png',
            },
          ],
          apple: [
            {
              url: logoUrl,
              type: 'image/png',
            },
          ],
        }
      : undefined,

    openGraph: {
      title: nombre,
      description: descripcion,
      images: logoUrl
        ? [
            {
              url: logoUrl,
              alt: nombre,
            },
          ]
        : [],
      type: 'website',
      locale: 'es_BO',
      siteName: nombre,
    },

    twitter: {
      card: 'summary',
      title: nombre,
      description: descripcion,
      images: logoUrl ? [logoUrl] : [],
    },
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { nombre, logoUrl } = await getCarreraData()

  return (
    <html lang="es">
      <head>
        <title>{nombre}</title>

        {logoUrl && (
          <>
            <link rel="icon" href={logoUrl} type="image/png" />
            <link rel="shortcut icon" href={logoUrl} type="image/png" />
            <link rel="apple-touch-icon" href={logoUrl} />
          </>
        )}

        <meta name="application-name" content={nombre} />
        <meta name="theme-color" content="#dc2626" />
      </head>

      <body className={inter.className}>
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  )
}