'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingScreenProps {
  onComplete: () => void
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
  const [progress, setProgress] = useState(0)
  const [isComplete, setIsComplete] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(loadingMessages[0].message)

  useEffect(() => {
    // Simulation du chargement
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsComplete(true)
          setTimeout(() => {
            onComplete()
          }, 500)
          return 100
        }
        // Accélération progressive du chargement
        const increment = prev < 30 ? 2 : prev < 70 ? 3 : prev < 90 ? 5 : 10
        const newProgress = Math.min(prev + increment, 100)
        
        // Mettre à jour le message selon le progrès
        const message = [...loadingMessages].reverse().find(m => newProgress >= m.progress)
        if (message) {
          setCurrentMessage(message.message)
        }
        
        return newProgress
      })
    }, 50)

    return () => clearInterval(interval)
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

