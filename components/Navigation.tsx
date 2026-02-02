'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

const navItems = [
  { name: 'Projects', href: '/projects' },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <>
    <nav className="fixed top-0 left-0 right-0 z-50 bg-royal-navy/90 backdrop-blur-md border-b border-royal-gold/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
            <Link 
              href="/" 
              className="text-2xl sm:text-3xl md:text-4xl font-display font-bold tracking-tight gold-gradient"
              onClick={closeMenu}
            >
            AMEYA
          </Link>

            {/* Navigation Items Desktop - Masqué sur mobile */}
            <div className="hidden md:flex items-center gap-8 lg:gap-12">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative text-xs font-light tracking-[0.2em] uppercase transition-colors ${
                    isActive 
                      ? 'text-royal-gold-light' 
                      : 'text-white/60 hover:text-royal-gold-light'
                  }`}
                >
                  {item.name}
                  {isActive && (
                    <motion.div
                      className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-royal-gold to-transparent"
                      layoutId="navbar-indicator"
                      transition={{
                        type: 'spring',
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              )
            })}
            </div>

            {/* Bouton Hamburger - Visible uniquement sur mobile */}
            <button
              onClick={toggleMenu}
              className="md:hidden flex flex-col gap-1.5 w-6 h-6 justify-center items-center z-50 relative"
              aria-label="Toggle menu"
            >
              <motion.span
                className="block w-6 h-0.5 bg-white"
                animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="block w-6 h-0.5 bg-white"
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="block w-6 h-0.5 bg-white"
                animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
            </button>
          </div>
        </div>
      </nav>

      {/* Menu Mobile Plein Écran */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMenu}
            />
            
            {/* Menu */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-royal-navy z-50 md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full pt-24 px-8">
                <nav className="flex flex-col gap-8">
                  {navItems.map((item, index) => {
                    const isActive = pathname === item.href
                    return (
                      <motion.div
                        key={item.href}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.3 }}
                      >
                        <Link
                          href={item.href}
                          onClick={closeMenu}
                          className={`block text-2xl font-light tracking-[0.2em] uppercase transition-colors ${
                            isActive 
                              ? 'text-royal-gold-light' 
                              : 'text-white/80 hover:text-royal-gold-light'
                          }`}
                        >
                          {item.name}
                          {isActive && (
                            <motion.div
                              className="mt-2 h-px bg-gradient-to-r from-transparent via-royal-gold to-transparent"
                              layoutId="mobile-navbar-indicator"
                              transition={{
                                type: 'spring',
                                stiffness: 380,
                                damping: 30,
                              }}
                            />
                          )}
                        </Link>
                      </motion.div>
                    )
                  })}
                </nav>
      </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}