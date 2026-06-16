'use client'

import { useEffect } from 'react'
import { useInstitucionStore } from '@/store/useInstitucionStore'

const API_PUBLICA = 'https://serviciopagina.upea.bo'

const getImageUrl = (imagen?: string | null) => {
  if (!imagen) return ''

  const imagenLimpia = String(imagen).trim()
  if (!imagenLimpia) return ''

  if (imagenLimpia.startsWith('http://') || imagenLimpia.startsWith('https://')) {
    return imagenLimpia
  }

  return `${API_PUBLICA}/InstitucionUpea/${imagenLimpia}`
}

export default function DynamicFavicon() {
  const principal = useInstitucionStore((state) => state.principal)
  const fetchInstitucionPrincipal = useInstitucionStore(
    (state) => state.fetchInstitucionPrincipal
  )

  useEffect(() => {
    if (!principal) {
      fetchInstitucionPrincipal()
    }
  }, [principal, fetchInstitucionPrincipal])

  useEffect(() => {
    const institucion = principal?.Descripcion

    if (!institucion) return

    if (institucion.institucion_nombre) {
      document.title = `${institucion.institucion_nombre} - UPEA`
    }

    const logoBase = getImageUrl(institucion.institucion_logo)

    if (!logoBase) return

    const logo = `${logoBase}${logoBase.includes('?') ? '&' : '?'}favicon=${Date.now()}`

    const icons = document.querySelectorAll<HTMLLinkElement>(
      "link[rel='icon'], link[rel='shortcut icon'], link[rel='apple-touch-icon']"
    )

    icons.forEach((icon) => {
      icon.href = logo
    })

    let dynamicIcon = document.querySelector('#dynamic-favicon') as HTMLLinkElement | null

    if (!dynamicIcon) {
      dynamicIcon = document.createElement('link')
      dynamicIcon.id = 'dynamic-favicon'
      dynamicIcon.rel = 'icon'
      document.head.appendChild(dynamicIcon)
    }

    dynamicIcon.href = logo

    let dynamicShortcut = document.querySelector('#dynamic-shortcut-icon') as HTMLLinkElement | null

    if (!dynamicShortcut) {
      dynamicShortcut = document.createElement('link')
      dynamicShortcut.id = 'dynamic-shortcut-icon'
      dynamicShortcut.rel = 'shortcut icon'
      document.head.appendChild(dynamicShortcut)
    }

    dynamicShortcut.href = logo
  }, [principal])

  return null
}