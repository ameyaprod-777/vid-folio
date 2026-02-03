'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import VideoPlayer from './videoplayer'

interface LazyVideoPlayerProps {
  src: string
  className?: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  disableDownload?: boolean
  allowFullscreen?: boolean
  priority?: boolean // Pour précharger immédiatement (première vidéo)
}

// Fonction pour extraire l'ID Vimeo
function getVimeoId(url: string): string | null {
  if (!url.includes('vimeo.com')) return null
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

export default function LazyVideoPlayer({
  src,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
  disableDownload = false,
  allowFullscreen = true,
  priority = false,
}: LazyVideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Charger toutes les vidéos rapidement
    // La première vidéo se charge immédiatement, les autres avec un très court délai pour éviter la surcharge réseau
    const delay = priority ? 0 : 100

    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, delay)

    return () => clearTimeout(timer)
  }, [priority])

  const isVimeo = src.includes('vimeo.com')
  const thumbnail = isVimeo ? getVimeoThumbnail(src) : null

  return (
    <div ref={containerRef} className={`relative w-full h-full bg-black ${className}`}>
      {/* Thumbnail pendant le chargement */}
      {!isLoaded && thumbnail && (
        <div className="absolute inset-0 w-full h-full bg-black">
          <Image
            src={thumbnail}
            alt="Video thumbnail"
            fill
            className="object-cover"
            unoptimized
            priority={false}
          />
          {/* Overlay de chargement */}
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
            <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        </div>
      )}

      {/* Placeholder si pas de thumbnail */}
      {!isLoaded && !thumbnail && (
        <div className="absolute inset-0 bg-black flex items-center justify-center">
          <div className="w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        </div>
      )}

      {/* Vidéo chargée */}
      {isLoaded && (
        <div className="absolute inset-0 bg-black">
          <VideoPlayer
            src={src}
            autoPlay={autoPlay}
            loop={loop}
            muted={muted}
            controls={controls}
            disableDownload={disableDownload}
            allowFullscreen={allowFullscreen}
            className={className}
          />
        </div>
      )}
    </div>
  )
}

