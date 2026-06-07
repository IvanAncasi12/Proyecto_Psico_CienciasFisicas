'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/axios'
import styles from './Header.module.css'

type MenuItem = {
  label: string
  href: string
}

type Menu = {
  key: string
  label: string
  items: MenuItem[]
}

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState('')
  const [nombreInstitucion, setNombreInstitucion] = useState('Carrera')
  const [colores, setColores] = useState({
    primario: '#dc2626',
    secundario: '#2563eb',
  })
  const [scrolled, setScrolled] = useState(false)

  const headerRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '45'
        const baseUrl =
          process.env.NEXT_PUBLIC_API_BASE_URL ||
          'https://apiadministrador.upea.bo'

        const res = await apiClient.get(`/institucionesPrincipal/${id}`)
        const data = res.data?.Descripcion

        if (data?.institucion_logo) {
          const logo = data.institucion_logo
          setLogoUrl(logo.startsWith('http') ? logo : `${baseUrl}${logo}`)
        }

        if (data?.institucion_nombre) {
          setNombreInstitucion(`${data.institucion_nombre}`)
        }

        const cols = data?.colorinstitucion?.[0]

        if (cols) {
          setColores({
            primario: cols.color_primario || '#dc2626',
            secundario: cols.color_secundario || '#2563eb',
          })
        }
      } catch (error) {
        console.warn('Error Header:', error)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }

    handleScroll()

    window.addEventListener('scroll', handleScroll)

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024) {
        setMobileMenuOpen(false)
        setActiveDropdown(null)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        headerRef.current &&
        !headerRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev)
    setActiveDropdown(null)
  }

  const toggleDropdown = (menu: string) => {
    setActiveDropdown((prev) => (prev === menu ? null : menu))
  }

  const closeMenus = () => {
    setMobileMenuOpen(false)
    setActiveDropdown(null)
  }

  const menus: Menu[] = [
    {
      key: 'carrera',
      label: 'Carrera',
      items: [
        { label: 'Nosotros', href: '/carrera/nosotros' },
        { label: 'Autoridades', href: '/carrera/autoridades' },
      ],
    },
    {
      key: 'academico',
      label: 'Académico',
      items: [
        { label: 'Cursos', href: '/academico/cursos' },
        { label: 'Seminarios', href: '/academico/seminarios' },
        { label: 'Convocatorias', href: '/academico/convocatorias' },
        { label: 'Ofertas Académicas', href: '/academico/ofertas-academicas' },
        { label: 'Gacetas', href: '/academico/gacetas' },
      ],
    },
    {
      key: 'comunicados',
      label: 'Comunicados',
      items: [
        { label: 'Avisos', href: '/comunicados/avisos' },
        { label: 'Comunicados', href: '/comunicados/comunicados' },
        { label: 'Servicios', href: '/comunicados/servicios' },
      ],
    },
    {
      key: 'eventos',
      label: 'Eventos',
      items: [
        { label: 'Eventos', href: '/eventos/eventos' },
        { label: 'Talleres', href: '/eventos/talleres' },
      ],
    },
  ]

  return (
    <header
      ref={headerRef}
      className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}
      style={
        {
          '--header-primary': colores.primario,
          '--header-secondary': colores.secundario,
        } as CSSProperties
      }
    >
      <div className={styles.topGlow} />

      <nav className={styles.navContainer}>
        <Link href="/" className={styles.logoSection} onClick={closeMenus}>
          <div className={styles.logoOuter}>
            <div className={styles.logoWrapper}>
              <img
                src={
                  logoUrl ||
                  'https://ui-avatars.com/api/?name=UPEA&background=dc2626&color=fff&size=128'
                }
                alt={nombreInstitucion}
                className={styles.logo}
              />
            </div>
          </div>

          <div className={styles.brandText}>
            <span className={styles.brandLabel}>Universidad Pública de El Alto</span>
            <span className={styles.institutionName}>{nombreInstitucion}</span>
          </div>
        </Link>

        <div className={styles.desktopNav}>
          <Link href="/" className={styles.navLink} onClick={closeMenus}>
            Inicio
          </Link>

          {menus.map((menu) => (
            <div key={menu.key} className={styles.dropdownWrapper}>
              <button
                type="button"
                onClick={() => toggleDropdown(menu.key)}
                className={`${styles.navLink} ${styles.dropdownBtn} ${
                  activeDropdown === menu.key ? styles.navLinkActive : ''
                }`}
              >
                {menu.label}

                <svg
                  className={`${styles.arrow} ${
                    activeDropdown === menu.key ? styles.active : ''
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.3}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {activeDropdown === menu.key && (
                <div className={styles.dropdownMenu}>
                  <div className={styles.dropdownHeader}>
                    <span>{menu.label}</span>
                  </div>

                  {menu.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={styles.dropdownItem}
                      onClick={closeMenus}
                    >
                      <span className={styles.dropdownDot} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link href="/enlaces" className={styles.navLink} onClick={closeMenus}>
            Enlaces
          </Link>

          <Link href="/contacto" className={styles.navLink} onClick={closeMenus}>
            Contacto
          </Link>
        </div>

        <div className={styles.actions}>
          <a
            href="https://servicioadministrador.upea.bo"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.loginBtn}
          >
            <span>Ingresar</span>

            <svg
              className={styles.loginIcon}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.4}
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
          </a>

          <button
            type="button"
            className={`${styles.mobileMenuBtn} ${
              mobileMenuOpen ? styles.mobileMenuBtnActive : ''
            }`}
            onClick={toggleMobileMenu}
            aria-label="Abrir menú"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      <div
        className={`${styles.mobileOverlay} ${
          mobileMenuOpen ? styles.mobileOverlayActive : ''
        }`}
        onClick={closeMenus}
      />

      <div
        className={`${styles.mobileMenu} ${
          mobileMenuOpen ? styles.mobileMenuOpen : ''
        }`}
      >
        <div className={styles.mobileHeader}>
          <div className={styles.mobileBrand}>
            <img
              src={
                logoUrl ||
                'https://ui-avatars.com/api/?name=UPEA&background=dc2626&color=fff&size=128'
              }
              alt={nombreInstitucion}
              className={styles.mobileLogo}
            />

            <div>
              <span className={styles.mobileBrandLabel}>Menú</span>
              <strong>{nombreInstitucion}</strong>
            </div>
          </div>

          <button
            type="button"
            className={styles.mobileClose}
            onClick={closeMenus}
            aria-label="Cerrar menú"
          >
            ×
          </button>
        </div>

        <div className={styles.mobileLinks}>
          <Link href="/" className={styles.mobileLink} onClick={closeMenus}>
            Inicio
          </Link>

          {menus.map((menu) => (
            <div key={menu.key} className={styles.mobileGroup}>
              <button
                type="button"
                className={`${styles.mobileSection} ${
                  activeDropdown === menu.key ? styles.mobileSectionActive : ''
                }`}
                onClick={() => toggleDropdown(menu.key)}
              >
                <span>{menu.label}</span>

                <svg
                  className={`${styles.mobileArrow} ${
                    activeDropdown === menu.key ? styles.mobileArrowActive : ''
                  }`}
                  width="18"
                  height="18"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.4}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {activeDropdown === menu.key && (
                <div className={styles.mobileSubmenu}>
                  {menu.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={styles.mobileSublink}
                      onClick={closeMenus}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link href="/enlaces" className={styles.mobileLink} onClick={closeMenus}>
            Enlaces
          </Link>

          <Link href="/contacto" className={styles.mobileLink} onClick={closeMenus}>
            Contacto
          </Link>
        </div>

        <a
          href="https://servicioadministrador.upea.bo"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mobileLogin}
        >
          Iniciar Sesión
        </a>
      </div>
    </header>
  )
}