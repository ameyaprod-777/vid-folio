'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

// Images de la galerie (remplacez par vos propres images)
const galleryImages = [
  '/ameyapolar2.png',
  '/ameyaxgunna2.png',
  '/ameyaxice2.png',
  '/realwizzameya.png',
  '/ameyaxnadym2.png',
]

// Logos des clients
const clientLogos = [
  '/client-argentic.jpeg',
  '/client-arista.png',
  '/client-colombus.png',
  '/client-defjam.png',
  '/client-epic.png',
  '/client-fitnesspark.webp',
  '/client-millenium.jpg',
  '/client-rca.png',
  '/client-sony.png',
  '/client-universal.png',
  '/client-virgin.png',
  '/client-warner.png',
  '/client-jmfilms.webp',
  '/client-argo.webp',
  '/client-nak.jpg',
]

export default function AboutPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  // Auto-scroll de la galerie
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryImages.length)
    }, 3000) // Change d'image toutes les 3 secondes

    return () => clearInterval(interval)
  }, [])

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header Simple - Style donprod */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            {/* Logo gauche */}
            <Link href="/" className="flex items-center">
              <Image
                src="/logoameyasimple.png"
                alt="AMEYA"
                width={60}
                height={60}
                className="h-8 w-auto sm:h-10 md:h-12 object-contain"
                priority
              />
            </Link>

            {/* Icône Menu Hamburger */}
            <button
              onClick={toggleMenu}
              className="flex flex-col gap-1.5 w-6 h-6 justify-center items-center z-50 relative"
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
      </header>

      {/* Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              onClick={closeMenu}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-black z-50 shadow-2xl"
            >
              <div className="flex flex-col h-full pt-24 px-8">
                <nav className="flex flex-col gap-8">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1, duration: 0.3 }}
                  >
                    <Link
                      href="/about"
                      onClick={closeMenu}
                      className="block text-2xl font-medium tracking-[0.2em] uppercase transition-colors text-white hover:opacity-70"
                    >
                      ABOUT
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <Link
                      href="/projects"
                      onClick={closeMenu}
                      className="block text-2xl font-medium tracking-[0.2em] uppercase transition-colors text-white hover:opacity-70"
                    >
                      WORKS
                    </Link>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <Link
                      href="/contact"
                      onClick={closeMenu}
                      className="block text-2xl font-medium tracking-[0.2em] uppercase transition-colors text-white hover:opacity-70"
                    >
                      CONTACT
                    </Link>
                  </motion.div>
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="pt-32 sm:pt-40 pb-10 sm:pb-16">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Logo - En haut */}
          <motion.div
            className="flex justify-center mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Image
              src="/logo-ameya-white-png.png"
              alt="AMEYA PROD Logo"
              width={200}
              height={200}
              className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 lg:w-56 lg:h-56 object-contain"
            />
          </motion.div>

          {/* Paragraphe explicatif */}
          <motion.div
            className="max-w-4xl mx-auto mb-16 sm:mb-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="space-y-4 sm:space-y-6">
              <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed text-center">
                Driven by a passion for imagery since the age of 14, I cut my teeth in the fast-paced world of video game editing. What started as a teenage hobby quickly evolved into a lifelong calling for visual storytelling. Today, as a director and editor, I infuse every project with that same sense of rhythm and high-impact energy.
              </p>
              {/* Galerie de photos qui défile - juste sous le premier paragraphe */}
              <motion.div
                className="w-full overflow-hidden mt-8 sm:mt-10 px-6 sm:px-8 lg:px-12"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <div className="relative w-full max-w-4xl mx-auto" style={{ aspectRatio: '1000/650' }}>
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentIndex}
                      initial={{ opacity: 0, x: 100 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 w-full h-full flex items-center justify-center"
                    >
                      <Image
                        src={galleryImages[currentIndex]}
                        alt={`Gallery image ${currentIndex + 1}`}
                        width={1000}
                        height={650}
                        className="object-contain w-full h-full"
                        priority={currentIndex === 0}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1280px"
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Compteur d'images */}
                <motion.div
                  className="text-center mt-6 sm:mt-8 max-w-7xl mx-auto"
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="text-sm sm:text-base md:text-lg uppercase tracking-wider font-medium text-white/80">
                    {(currentIndex + 1).toString().padStart(2, '0')} / {galleryImages.length.toString().padStart(2, '0')}
                  </span>
                </motion.div>
              </motion.div>
              <p className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed text-center">
                My signature style? A balance between refined aesthetics crafting every frame as a &quot;beautiful canvas&quot; and the dynamic movement inherited from my early days. Whether it's a music video, a commercial, or an artistic project, I transform concepts into unforgettable cinematic experiences.
              </p>
              {/* Section Clients - They Trust Me avec logos qui défilent */}
              <motion.div
                className="w-full overflow-hidden pt-8 sm:pt-10"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                {/* Titre */}
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider font-medium text-white/90 font-akira">
                    They Trust Me
                  </h2>
                </div>

                {/* Carousel de logos qui défile */}
                <div className="relative w-full overflow-hidden">
                  <div className="flex animate-scroll">
                    {/* Première série de logos */}
                    {clientLogos.map((logo, index) => (
                      <div
                        key={`first-${index}`}
                        className="flex-shrink-0 mx-6 sm:mx-8 md:mx-12"
                      >
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                          <Image
                            src={logo}
                            alt={`Client logo ${index + 1}`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 160px"
                          />
                        </div>
                      </div>
                    ))}
                    {/* Deuxième série de logos (pour l'effet de boucle infinie) */}
                    {clientLogos.map((logo, index) => (
                      <div
                        key={`second-${index}`}
                        className="flex-shrink-0 mx-6 sm:mx-8 md:mx-12"
                      >
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
                          <Image
                            src={logo}
                            alt={`Client logo ${index + 1}`}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 160px"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
            {/* Services et Localisation - Layout en deux colonnes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16 mb-8 sm:mb-12">
            {/* Services - Colonne gauche */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <ul className="space-y-4 sm:space-y-6">
                <li className="text-base sm:text-lg md:text-xl uppercase tracking-wider font-medium">
                  DIRECTOR
                </li>
                <li className="text-base sm:text-lg md:text-xl uppercase tracking-wider font-medium">
                  EDITOR
                </li>
                <li className="text-base sm:text-lg md:text-xl uppercase tracking-wider font-medium">
                  VISUAL EFFECTS
                </li>
                <li className="text-base sm:text-lg md:text-xl uppercase tracking-wider font-medium">
                  FILMMAKER
                </li>
              </ul>
            </motion.div>

            {/* Localisation - Colonne droite */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <ul className="space-y-4 sm:space-y-6">
                <li className="text-base sm:text-lg md:text-xl uppercase tracking-wider font-medium">
                  PARIS, FR
                </li>
                <li className="text-base sm:text-lg md:text-xl uppercase tracking-wider font-medium">
                  WORLDWIDE
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  )
}

