'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { apiClient } from '@/lib/axios'
import styles from './Header.module.css'

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [logoUrl, setLogoUrl] = useState('')
  const [nombreInstitucion, setNombreInstitucion] = useState('Carrera')
  const [colores, setColores] = useState({ primario: '#6366f1', secundario: '#14b8a6' })
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = process.env.NEXT_PUBLIC_INSTITUCION_ID || '45'
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://apiadministrador.upea.bo'
        const res = await apiClient.get(`/institucionesPrincipal/${id}`)
        const data = res.data?.Descripcion

        if (data?.institucion_logo) {
          const logo = data.institucion_logo
          setLogoUrl(logo.startsWith('http') ? logo : `${baseUrl}${logo}`)
        }
        if (data?.institucion_nombre) setNombreInstitucion(`Carrera de ${data.institucion_nombre}`)
        
        const cols = data?.colorinstitucion?.[0]
        if (cols) {
          setColores({
            primario: cols.color_primario || '#6366f1',
            secundario: cols.color_secundario || '#14b8a6'
          })
        }
      } catch (error) { console.warn('Error Header:', error) }
    }
    fetchData()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--header-bg', colores.primario)
    root.style.setProperty('--header-accent', colores.secundario)
  }, [colores])

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

  const toggleMobileMenu = () => setMobileMenuOpen(prev => !prev)
  const toggleDropdown = (menu: string) => setActiveDropdown(prev => prev === menu ? null : menu)

  const menus = [
    { key: 'carrera', label: 'Carrera', items: [
      { label: 'Nosotros', href: '/carrera/nosotros' },
      { label: 'Autoridades', href: '/carrera/autoridades' }
    ]},
    { key: 'academico', label: 'Académico', items: [
      { label: 'Cursos', href: '/academico/cursos' },
      { label: 'Seminarios', href: '/academico/seminarios' },
      { label: 'Convocatorias', href: '/academico/convocatorias' },
      { label: 'Ofertas Académicas', href: '/academico/ofertas-academicas' },
      { label: 'Gacetas', href: '/academico/gacetas' }
    ]},
    { key: 'comunicados', label: 'Comunicados', items: [
      { label: 'Avisos', href: '/comunicados/avisos' },
      { label: 'Comunicados', href: '/comunicados/comunicados' },
      { label: 'Servicios', href: '/comunicados/servicios' }
    ]},
    { key: 'eventos', label: 'Eventos', items: [
      { label: 'Eventos', href: '/eventos/eventos' },
      { label: 'Talleres', href: '/eventos/talleres' }
    ]}
  ]

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <nav className={styles.navContainer}>
        
        {/* Logo */}
        <Link href="/" className={styles.logoSection}>
          <div className={styles.logoWrapper}>
            <img 
              src={logoUrl || 'https://ui-avatars.com/api/?name=UPEA&background=6366f1&color=fff&size=128'} 
              alt="Logo" 
              className={styles.logo}
            />
          </div>
          <span className={styles.institutionName}>{nombreInstitucion}</span>
        </Link>

        {/* Desktop Nav */}
        <div className={styles.desktopNav}>
          <Link href="/" className={styles.navLink}>Inicio</Link>
          
          {menus.map((menu) => (
            <div key={menu.key} className={styles.dropdownWrapper}>
              <button 
                onClick={() => toggleDropdown(menu.key)} 
                className={`${styles.navLink} ${styles.dropdownBtn}`}
                type="button"
              >
                {menu.label}
                <svg className={`${styles.arrow} ${activeDropdown === menu.key ? styles.active : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {activeDropdown === menu.key && (
                <div className={styles.dropdownMenu}>
                  {menu.items.map((item, idx) => (
                    <Link key={idx} href={item.href} className={styles.dropdownItem} onClick={() => setActiveDropdown(null)}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}

          <Link href="/enlaces" className={styles.navLink}>Enlaces</Link>
          <Link href="/contacto" className={styles.navLink}>Contacto</Link>
        </div>

        {/* Login Button */}
        <div className={styles.loginSection}>
          <a
            href="https://servicioadministrador.upea.bo"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.loginBtn}
          >
            Ingresar
          </a>
        </div>

        {/* Mobile Button */}
        <button 
          type="button"
          className={styles.mobileMenuBtn} 
          onClick={toggleMobileMenu}
          aria-label="Menú"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
            />
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <Link href="/" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>Inicio</Link>
          {menus.map((menu) => (
            <div key={menu.key}>
              <button
                type="button"
                className={styles.mobileSection}
                onClick={() => toggleDropdown(menu.key)}
              >
                {menu.label}
                <svg className={`transition-transform ${activeDropdown === menu.key ? 'rotate-180' : ''}`} width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === menu.key && (
                <div className={styles.mobileSubmenu}>
                  {menu.items.map((item, idx) => (
                    <Link key={idx} href={item.href} className={styles.mobileSublink} onClick={() => setMobileMenuOpen(false)}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Link href="/enlaces" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>Enlaces</Link>
          <Link href="/contacto" className={styles.mobileLink} onClick={() => setMobileMenuOpen(false)}>Contacto</Link>
          <div className={styles.mobileLogin}>
            <a href="https://servicioadministrador.upea.bo" target="_blank" rel="noopener noreferrer">Iniciar Sesión</a>
          </div>
        </div>
      )}
    </header>
  )
}