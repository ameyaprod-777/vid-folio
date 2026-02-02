'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { motion, AnimatePresence } from 'framer-motion'
import VideoPlayer from '@/components/videoplayer'
import Link from 'next/link'
import Image from 'next/image'

gsap.registerPlugin(ScrollTrigger)

const featuredProjects = [
  {
    id: 1,
    title: 'RK - BIG CHOPARD',
    artist: 'DIRECTOR / EDITOR',
    video: 'https://vimeo.com/1157924020?fl=tl&fe=ec',
  },
  {
    id: 2,
    title: 'LANDY - GRINTA',
    artist: 'DIRECTOR / EDITOR',
    video: 'https://vimeo.com/1157924898?share=copy&fl=sv&fe=ci',
  },
  {
    id: 3,
    title: 'Wizkid & Brent Faiyaz - Piece of My Heart',
    artist: 'Camera Operator',
    video: 'https://vimeo.com/1045245386?fl=tl&fe=ec',
  },
  {
    id: 4,
    title: 'Zed & Green Montana - FAME',
    artist: 'Co-Director / Editor / Colorist',
    video: 'https://vimeo.com/https://vimeo.com/1157926149?share=copy&fl=sv&fe=ci?fl=tl&fe=ec',
  },
]

export default function Home() {
  const projectsRef = useRef<HTMLDivElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animation des projets
      gsap.from('.project-item', {
        scrollTrigger: {
          trigger: '.projects-section',
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
      })
    })

    return () => ctx.revert()
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header Simple - Style donprod */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            {/* Logo gauche */}
            <Link href="/" className="text-base sm:text-lg md:text-xl uppercase tracking-tight font-bold font-akira">
              AMEYA
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
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
              onClick={closeMenu}
            />
            
            {/* Menu */}
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

      {/* Logo Principal Centré - Style donprod */}
      <section className="pt-32 sm:pt-40 pb-8 sm:pb-12 px-6 sm:px-8">
        <div className="text-center">
          <motion.div
            className="main-logo flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Image
              src="/logo-ameya-white-png.png"
              alt="AMEYA PROD Logo"
              width={200}
              height={200}
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain"
              priority
            />
          </motion.div>
        </div>
      </section>

      {/* Projects Section - Style donprod */}
      <section ref={projectsRef} className="projects-section pb-20 sm:pb-32 px-6 sm:px-8 lg:px-12">
        <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12">
          {featuredProjects.map((project) => (
            <motion.div
            key={project.id}
              className="project-item group cursor-pointer"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.3 }}
          >
              {/* Vidéo avec bordure fine */}
              <div className="relative w-full aspect-video bg-black border border-black overflow-hidden">
              <VideoPlayer
                src={project.video}
                autoPlay
                loop
                muted
                className="w-full h-full object-cover"
              />
            </div>

              {/* Bande noire avec texte - Style donprod */}
              <div className="bg-black py-4 sm:py-5 px-4 sm:px-6 flex items-center justify-between">
                <span className="text-sm sm:text-base md:text-lg uppercase tracking-wider font-medium text-white">
                  {project.title}
                </span>
                <span className="text-sm sm:text-base md:text-lg uppercase tracking-wider font-medium text-white">
                  {project.artist}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer Section - Back to top et réseaux sociaux */}
      <footer className="pt-16 sm:pt-20 pb-12 sm:pb-16 px-6 sm:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col items-center gap-6 sm:gap-8">
            {/* Back to Top - Style inspiré de l'image */}
            <motion.button
              onClick={scrollToTop}
              className="text-2xl sm:text-3xl md:text-4xl uppercase tracking-wider font-bold text-white hover:opacity-80 transition-opacity"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              BACK TO THE TOP
            </motion.button>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-6 sm:gap-8">
              <motion.a
                href="https://www.instagram.com/ameya.films/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base uppercase tracking-wider font-bold text-white hover:opacity-80 transition-opacity"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                INSTA
              </motion.a>
              <motion.a
                href="https://www.tiktok.com/@ameyaprod"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base uppercase tracking-wider font-bold text-white hover:opacity-80 transition-opacity"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                TIKTOK
              </motion.a>
              <motion.a
                href="https://vimeo.com/ameyaproductions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm sm:text-base uppercase tracking-wider font-bold text-white hover:opacity-80 transition-opacity"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                VIMEO
              </motion.a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}