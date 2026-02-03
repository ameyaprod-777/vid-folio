'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import VideoPlayer from '@/components/videoplayer'

type Category = 'All' | 'Director' | 'Editor' | 'Photos' | 'Commercial' | 'Colorist' | 'Camera Operator'

interface Project {
  id: number
  title: string
  category: Category
  video: string
  thumbnail?: string
  description?: string
}

// Fonction pour extraire l'ID Vimeo depuis une URL
function getVimeoId(url: string): string | null {
  const cleanUrl = url.split('?')[0]
  const match = cleanUrl.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
}

// Fonction pour extraire l'ID YouTube depuis une URL
function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

// Fonction pour générer le thumbnail Vimeo
function getVimeoThumbnail(vimeoUrl: string): string | null {
  const vimeoId = getVimeoId(vimeoUrl)
  if (!vimeoId) return null
  return `https://vumbnail.com/${vimeoId}.jpg`
}

// Fonction pour générer le thumbnail YouTube
function getYouTubeThumbnail(youtubeUrl: string): string | null {
  const youtubeId = getYouTubeId(youtubeUrl)
  if (!youtubeId) return null
  // Utilise l'API YouTube pour obtenir le thumbnail en haute qualité
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
}

// Fonction pour obtenir le thumbnail (Vimeo ou YouTube)
function getVideoThumbnail(videoUrl: string): string | null {
  if (videoUrl.includes('vimeo.com')) {
    return getVimeoThumbnail(videoUrl)
  }
  if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
    return getYouTubeThumbnail(videoUrl)
  }
  return null
}

const projects: Project[] = [
  {
    id: 1,
    title: 'RK - BIG CHOPARD',
    category: 'Director',
    video: 'https://www.youtube.com/watch?v=N64CiTeEYDQ&list=RDN64CiTeEYDQ&start_radio=1',
    thumbnail: '/rk-chopard.png',
  },
  {
    id: 2,
    title: 'Landy - Grinta',
    category: 'Director',
    video: 'https://www.youtube.com/watch?v=ehEKCvzld-g&list=RDehEKCvzld-g&start_radio=1',
  },
  {
    id: 3,
    title: 'Zed & Green Montana - Fame',
    category: 'Director',
    video: 'https://www.youtube.com/watch?v=VKiPgi99E3k&list=RDVKiPgi99E3k&start_radio=1',
    thumbnail: '/zedgreenfame.jpg',
  },
  {
    id: 4,
    title: 'Ice Spice - Baddie Baddie',
    category: 'Camera Operator',
    video: 'https://www.youtube.com/watch?v=qGzKA3aROGE&list=RDqGzKA3aROGE&start_radio=1',
  },
  {
    id: 5,
    title: 'Wizkid & Brent Faiyaz - Piece of My Heart',
    category: 'Camera Operator',
    video: 'https://www.youtube.com/watch?v=zr_sTaYTCnU&list=RDzr_sTaYTCnU&start_radio=1&pp=ygUMd2l6a2lkIGJyZW50oAcB',
    thumbnail: '/wizkidbrent.png',
  },
  {
    id: 6,
    title: 'DYSTINCT & FRENCH MONTANA - YA BABA',
    category: 'Editor',
    video: 'https://www.youtube.com/watch?v=pX_TaoV6azw&list=RDpX_TaoV6azw&start_radio=1',
    thumbnail: '/dystinctfrench.webp',
  },
  {
    id: 7,
    title: 'RK & Ninho - Sale Etat',
    category: 'Editor',
    video: 'https://www.youtube.com/watch?v=ukEQApcWuhU&list=RDukEQApcWuhU&start_radio=1&pp=ygUScmsgbmluaG8gc2FsZSBldGF0oAcB',
    thumbnail: '/rkninho.jpeg',
  },
  {
    id: 8,
    title: 'Soolking & L2B - Tour Du Monde',
    category: 'Editor',
    video: 'https://www.youtube.com/watch?v=j5iOQ9qgThg&list=RDj5iOQ9qgThg&start_radio=1&pp=ygUMc29vbGtpbmcgbDJioAcB',
    thumbnail: '/soolkingl2b.jpg',
  },
  {
    id: 9,
    title: 'Guy2Bezbar - Batmobile',
    category: 'Editor',
    video: 'https://www.youtube.com/watch?v=2L0cNtPNaGc&list=RD2L0cNtPNaGc&start_radio=1&pp=ygUOZ3V5MiBiYXRtb2JpbGWgBwE%3D',
    thumbnail: '/g2batmobile.jpg',
  },
]

const categories: Category[] = ['All', 'Director', 'Editor', 'Camera Operator']

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState<Category>('All')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)

  const filteredProjects = useMemo(() => {
    if (activeCategory === 'All') {
      return projects
    }
    return projects.filter((project) => project.category === activeCategory)
  }, [activeCategory])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
  }

  const closeModal = () => {
    setSelectedProject(null)
  }

  // Fonction pour détecter si c'est une vidéo YouTube
  const isYouTubeVideo = (url: string): boolean => {
    return url.includes('youtube.com') || url.includes('youtu.be')
  }

  // Empêcher le téléchargement et le clic droit
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      if (selectedProject) {
        e.preventDefault()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedProject && (e.key === 's' || (e.ctrlKey && e.key === 's'))) {
        e.preventDefault()
      }
    }

    if (selectedProject) {
      document.addEventListener('contextmenu', handleContextMenu)
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedProject])

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

      <div className="pt-32 sm:pt-40 pb-20 sm:pb-32 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <motion.div
            className="mb-12 sm:mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tight mb-4">
              WORKS
            </h1>
          </motion.div>

          {/* Filter Buttons */}
          <motion.div
            className="flex flex-wrap gap-3 sm:gap-4 mb-12 sm:mb-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium uppercase tracking-wider transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-white text-black'
                    : 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                }`}
              >
                {category}
              </button>
            ))}
          </motion.div>

          {/* Projects Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  className="group relative overflow-hidden bg-gray-900 aspect-video cursor-pointer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleProjectClick(project)}
                >
                  {/* Thumbnail Image */}
                  {project.thumbnail ? (
                    <div className="absolute inset-0">
                      <Image
                        src={project.thumbnail}
                        alt={project.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : getVideoThumbnail(project.video) ? (
                    <div className="absolute inset-0">
                      <Image
                        src={getVideoThumbnail(project.video)!}
                        alt={project.title}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-black" />
                  )}

                  {/* Overlay avec icône play */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ scale: 0.8 }}
                      whileHover={{ scale: 1 }}
                    >
                      <svg
                        width="60"
                        height="60"
                        viewBox="0 0 60 60"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-white"
                      >
                        <circle cx="30" cy="30" r="30" fill="white" fillOpacity="0.2" />
                        <path
                          d="M25 20L25 40L40 30L25 20Z"
                          fill="white"
                        />
                      </svg>
                    </motion.div>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-xs uppercase tracking-wider text-white/60 mb-2 block">
                      {project.category}
                    </span>
                    <h3 className="text-lg sm:text-xl md:text-2xl font-bold uppercase tracking-tight">{project.title}</h3>
                  </div>

                  {/* Title always visible */}
                  <div className="absolute top-4 left-4">
                    <span className="text-xs uppercase tracking-wider text-white/80 bg-black/50 px-3 py-1">
                      {project.category}
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredProjects.length === 0 && (
            <motion.div
              className="text-center py-20"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <p className="text-base sm:text-lg md:text-xl text-white/60 uppercase tracking-wider">No projects found in this category.</p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modal Visualiseur Vidéo */}
      <AnimatePresence>
        {selectedProject && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-[100]"
              onClick={closeModal}
            />

            {/* Modal Content */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[101] flex items-center justify-center p-4 sm:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-6xl bg-black border border-white/20 relative">
                {/* Bouton Retour */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10 bg-black/80 hover:bg-black px-4 py-2 sm:px-6 sm:py-3 border border-white/20 hover:border-white/40 transition-all group"
                  aria-label="Close"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 20 20"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="text-white group-hover:opacity-80 transition-opacity"
                    >
                      <path
                        d="M12 4L6 10L12 16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-xs sm:text-sm uppercase tracking-wider text-white group-hover:opacity-80 transition-opacity">
                      BACK
                    </span>
                  </div>
                </button>

                {/* Vidéo avec protection */}
                <div
                  className="relative w-full aspect-video bg-black"
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                >
                  <VideoPlayer
                    src={selectedProject.video}
                    autoPlay
                    loop={false}
                    muted={false}
                    controls={true}
                    disableDownload={true}
                    allowFullscreen={true}
                    className="w-full h-full"
                  />
                </div>

                {/* Description - Masquée pour les vidéos YouTube */}
                {!isYouTubeVideo(selectedProject.video) && (
                  <div className="p-6 sm:p-8 border-t border-white/10">
                    <div className="mb-4">
                      <span className="text-xs sm:text-sm uppercase tracking-wider text-white/60 mb-2 block">
                        {selectedProject.category}
                      </span>
                      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-4">
                        {selectedProject.title}
                      </h2>
                    </div>
                    {selectedProject.description && (
                      <p className="text-sm sm:text-base text-white/80 leading-relaxed max-w-3xl">
                        {selectedProject.description}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  )
}

