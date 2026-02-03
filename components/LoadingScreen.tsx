'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'

interface LoadingScreenProps {
  onComplete: () => void
}

// Liste des ressources à précharger (sera mise à jour dynamiquement)
const getResourcesToLoad = () => {
  // Vidéos de la page d'accueil (Vimeo)
  const homeVideos = [
    'https://vimeo.com/1157924020',
    'https://vimeo.com/1157924898',
    'https://vimeo.com/1045245386',
    'https://vimeo.com/1157926149',
  ]

  // Vidéos de la page Projects (YouTube)
  const projectVideos = [
    'https://www.youtube.com/watch?v=N64CiTeEYDQ',
    'https://www.youtube.com/watch?v=ehEKCvzld-g',
    'https://www.youtube.com/watch?v=VKiPgi99E3k',
    'https://www.youtube.com/watch?v=qGzKA3aROGE',
    'https://www.youtube.com/watch?v=zr_sTaYTCnU',
    'https://www.youtube.com/watch?v=pX_TaoV6azw',
    'https://www.youtube.com/watch?v=ukEQApcWuhU',
    'https://www.youtube.com/watch?v=j5iOQ9qgThg',
    'https://www.youtube.com/watch?v=2L0cNtPNaGc',
  ]

  // Images importantes de toutes les pages
  const importantImages = [
    '/logo-ameya-white-png.png',
    '/ameya-white2.png',
    // Images de la page About
    '/ameyapolar2.png',
    '/ameyaxgunna2.png',
    '/ameyaxice2.png',
    '/realwizzameya.png',
    '/ameyapix1.png',
    // Logos clients
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
    // Images de la page Projects
    '/rk-chopard.png',
    '/zedgreenfame.jpg',
    '/wizkidbrent.png',
    '/dystinctfrench.webp',
    '/rkninho.jpeg',
    '/soolkingl2b.jpg',
    '/g2batmobile.jpg',
  ]

  // Pages à précharger
  const pagesToPreload = [
    '/',
    '/about',
    '/projects',
    '/contact',
  ]

  return {
    images: importantImages,
    videos: homeVideos,
    projectVideos: projectVideos,
    pages: pagesToPreload,
  }
}

// Fonction pour extraire l'ID Vimeo
function getVimeoId(url: string): string | null {
  const cleanUrl = url.split('?')[0]
  const match = cleanUrl.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
}

// Fonction pour générer le thumbnail Vimeo
function getVimeoThumbnail(vimeoUrl: string): string | null {
  const vimeoId = getVimeoId(vimeoUrl)
  if (!vimeoId) return null
  return `https://vumbnail.com/${vimeoId}.jpg`
}

// Fonction pour extraire l'ID YouTube
function getYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
  ]
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) return match[1]
  }
  return null
}

// Fonction pour générer le thumbnail YouTube
function getYouTubeThumbnail(youtubeUrl: string): string | null {
  const youtubeId = getYouTubeId(youtubeUrl)
  if (!youtubeId) return null
  return `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`
}

const loadingMessages = [
  { progress: 0, message: 'Initializing Timeline' },
  { progress: 20, message: 'Loading Assets' },
  { progress: 40, message: 'Rendering Sequences' },
  { progress: 60, message: 'Processing Media' },
  { progress: 80, message: 'Finalizing Project' },
  { progress: 95, message: 'Ready' },
]

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const router = useRouter()
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0].message)
  const startTime = useRef<number>(Date.now())
  const loadingDuration = 3000 // 3 secondes exactement
  const resourcesLoaded = useRef<boolean>(false)
  const preloadIframes = useRef<HTMLIFrameElement[]>([])

  useEffect(() => {
    const resourcesToLoad = getResourcesToLoad()
    let loadedResources = 0
    let totalResources = 0

    // Compter le total des ressources
    totalResources = resourcesToLoad.images.length + resourcesToLoad.videos.length + resourcesToLoad.projectVideos.length + resourcesToLoad.pages.length

    // Animation de la barre de progression (fausse progression)
    const progressInterval = setInterval(() => {
      const elapsed = Date.now() - startTime.current
      const fakeProgress = Math.min((elapsed / loadingDuration) * 100, 100)
      
      setProgress(Math.round(fakeProgress))

      // Mettre à jour le message selon la progression
      const message = [...loadingMessages].reverse().find(m => fakeProgress >= m.progress)
      if (message) {
        setCurrentMessage(message.message)
      }

      // Si on atteint 100% de la fausse progression
      if (fakeProgress >= 100) {
        clearInterval(progressInterval)
        
        // Vérifier si toutes les ressources sont chargées
        const checkResources = () => {
          if (loadedResources >= totalResources || resourcesLoaded.current) {
            // Tout est chargé, on peut continuer
            setProgress(100)
            setCurrentMessage('Ready')
            setTimeout(() => {
              setIsComplete(true)
              setTimeout(() => {
                onComplete()
              }, 500)
            }, 300)
          } else {
            // Attendre encore un peu si les ressources ne sont pas toutes chargées
            setTimeout(checkResources, 100)
          }
        }
        
        // Attendre un peu pour laisser les ressources finir de charger
        setTimeout(checkResources, 200)
      }
    }, 30) // Mise à jour toutes les 30ms pour une animation fluide

    // Précharger réellement toutes les ressources en arrière-plan
    const preloadResources = () => {

      // Précharger les images (en parallèle)
      resourcesToLoad.images.forEach((src, index) => {
        setTimeout(() => {
          const img = new window.Image()
          img.onload = () => {
            loadedResources++
            if (loadedResources >= totalResources) {
              resourcesLoaded.current = true
            }
          }
          img.onerror = () => {
            loadedResources++
            if (loadedResources >= totalResources) {
              resourcesLoaded.current = true
            }
          }
          img.src = src
        }, index * 15) // Petit délai entre chaque image
      })

      // Précharger les thumbnails Vimeo
      resourcesToLoad.videos.forEach((videoUrl, index) => {
        const thumbnail = getVimeoThumbnail(videoUrl)
        if (thumbnail) {
          setTimeout(() => {
            const img = new window.Image()
            img.onload = () => {
              loadedResources++
              if (loadedResources >= totalResources) {
                resourcesLoaded.current = true
              }
            }
            img.onerror = () => {
              loadedResources++
              if (loadedResources >= totalResources) {
                resourcesLoaded.current = true
              }
            }
            img.src = thumbnail
          }, 100 + (index * 25))
        } else {
          loadedResources++
          if (loadedResources >= totalResources) {
            resourcesLoaded.current = true
          }
        }
      })

      // Précharger les thumbnails YouTube
      resourcesToLoad.projectVideos.forEach((videoUrl, index) => {
        const thumbnail = getYouTubeThumbnail(videoUrl)
        if (thumbnail) {
          setTimeout(() => {
            const img = new window.Image()
            img.onload = () => {
              loadedResources++
              if (loadedResources >= totalResources) {
                resourcesLoaded.current = true
              }
            }
            img.onerror = () => {
              loadedResources++
              if (loadedResources >= totalResources) {
                resourcesLoaded.current = true
              }
            }
            img.src = thumbnail
          }, 150 + (index * 25))
        } else {
          loadedResources++
          if (loadedResources >= totalResources) {
            resourcesLoaded.current = true
          }
        }
      })

      // Précharger les iframes Vimeo en arrière-plan pour mettre en cache
      resourcesToLoad.videos.forEach((videoUrl, index) => {
        const vimeoId = getVimeoId(videoUrl)
        if (vimeoId) {
          setTimeout(() => {
            const iframe = document.createElement('iframe')
            iframe.src = `https://player.vimeo.com/video/${vimeoId}?autoplay=0&loop=0&muted=1&background=1&controls=0&playsinline=1&transparent=1`
            iframe.style.position = 'absolute'
            iframe.style.top = '-9999px'
            iframe.style.left = '-9999px'
            iframe.style.width = '1px'
            iframe.style.height = '1px'
            iframe.style.opacity = '0'
            iframe.style.pointerEvents = 'none'
            iframe.setAttribute('aria-hidden', 'true')
            
            // Compter l'iframe comme chargée après un délai
            setTimeout(() => {
              loadedResources++
              if (loadedResources >= totalResources) {
                resourcesLoaded.current = true
              }
            }, 500 + (index * 100))
            
            document.body.appendChild(iframe)
            preloadIframes.current.push(iframe)
          }, 200 + (index * 80))
        } else {
          loadedResources++
          if (loadedResources >= totalResources) {
            resourcesLoaded.current = true
          }
        }
      })

      // Précharger les iframes YouTube en arrière-plan pour mettre en cache
      resourcesToLoad.projectVideos.forEach((videoUrl, index) => {
        const youtubeId = getYouTubeId(videoUrl)
        if (youtubeId) {
          setTimeout(() => {
            const iframe = document.createElement('iframe')
            iframe.src = `https://www.youtube.com/embed/${youtubeId}?autoplay=0&mute=1&controls=0&rel=0&modestbranding=1&playsinline=1`
            iframe.style.position = 'absolute'
            iframe.style.top = '-9999px'
            iframe.style.left = '-9999px'
            iframe.style.width = '1px'
            iframe.style.height = '1px'
            iframe.style.opacity = '0'
            iframe.style.pointerEvents = 'none'
            iframe.setAttribute('aria-hidden', 'true')
            
            // Compter l'iframe comme chargée après un délai
            setTimeout(() => {
              loadedResources++
              if (loadedResources >= totalResources) {
                resourcesLoaded.current = true
              }
            }, 600 + (index * 100))
            
            document.body.appendChild(iframe)
            preloadIframes.current.push(iframe)
          }, 300 + (index * 60))
        } else {
          loadedResources++
          if (loadedResources >= totalResources) {
            resourcesLoaded.current = true
          }
        }
      })

      // Précharger les pages Next.js en arrière-plan avec le router
      resourcesToLoad.pages.forEach((page, index) => {
        setTimeout(() => {
          // Utiliser le router pour précharger les pages (plus efficace)
          router.prefetch(page)
          
          // Aussi utiliser fetch pour forcer le chargement
          fetch(page, { method: 'HEAD', cache: 'force-cache' })
            .then(() => {
              loadedResources++
              if (loadedResources >= totalResources) {
                resourcesLoaded.current = true
              }
            })
            .catch(() => {
              loadedResources++
              if (loadedResources >= totalResources) {
                resourcesLoaded.current = true
              }
            })
        }, 250 + (index * 80))
      })
    }

    // Démarrer le préchargement immédiatement
    preloadResources()

    // Timeout de sécurité : si après 5 secondes tout n'est pas chargé, on continue quand même
    const safetyTimeout = setTimeout(() => {
      resourcesLoaded.current = true
    }, 5000)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(safetyTimeout)
      // Nettoyer les iframes de préchargement créées
      preloadIframes.current.forEach((iframe) => {
        if (iframe.parentNode) {
          iframe.parentNode.removeChild(iframe)
        }
      })
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {!isComplete && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex items-center justify-center"
        >
          <div className="w-full max-w-2xl px-8">
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-12 flex flex-col items-center justify-center"
            >
              <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 relative">
                <Image
                  src="/ameya-white2.png"
                  alt="AMEYA Logo"
                  fill
                  priority
                  sizes="(max-width: 768px) 96px, 128px"
                  className="object-contain"
                />
              </div>
              <p className="mt-6 text-sm sm:text-base text-white/60 uppercase tracking-[0.2em] font-light">
                Loading Project
              </p>
            </motion.div>

            {/* Barre de progression */}
            <div className="relative">
              {/* Barre de fond */}
              <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                {/* Barre de progression animée */}
                <motion.div
                  className="h-full bg-gradient-to-r from-white/20 via-white to-white/20"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{
                    boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)',
                  }}
                />
              </div>

              {/* Indicateur de progression (point lumineux) */}
              <motion.div
                className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full"
                style={{
                  left: `${progress}%`,
                  transform: 'translateX(-50%) translateY(-50%)',
                  boxShadow: '0 0 15px rgba(255, 255, 255, 0.8)',
                }}
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            </div>

            {/* Pourcentage */}
            <motion.div
              className="mt-6 text-center"
              key={progress}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-2xl sm:text-3xl font-mono font-light text-white/90">
                {Math.round(progress)}%
              </span>
            </motion.div>

            {/* Informations de chargement (style logiciel de montage) */}
            <motion.div
              key={currentMessage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-12 text-center"
            >
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-white/40 uppercase tracking-wider font-light">
                <div className="w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" />
                <span>{currentMessage}</span>
              </div>
            </motion.div>

            {/* Lignes de grille en arrière-plan (effet timeline) */}
            <div className="absolute inset-0 pointer-events-none opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  repeating-linear-gradient(0deg, transparent, transparent 1px, white 1px, white 2px),
                  repeating-linear-gradient(90deg, transparent, transparent 1px, white 1px, white 2px)
                `,
                backgroundSize: '40px 40px',
              }} />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

