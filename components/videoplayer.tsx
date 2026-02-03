'use client'

import { useEffect, useRef } from 'react'

// Déclaration pour l'API YouTube IFrame
declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

interface VideoPlayerProps {
  src: string
  className?: string
  autoPlay?: boolean
  loop?: boolean
  muted?: boolean
  controls?: boolean
  disableDownload?: boolean
  allowFullscreen?: boolean
}

// Fonction pour détecter le type de vidéo
function getVideoType(src: string): 'vimeo' | 'youtube' | 'local' {
  if (src.includes('vimeo.com')) return 'vimeo'
  if (src.includes('youtube.com') || src.includes('youtu.be')) return 'youtube'
  return 'local'
}

// Fonction pour extraire l'ID Vimeo (gère les paramètres de requête)
function getVimeoId(url: string): string | null {
  // Enlève les paramètres de requête et extrait l'ID
  const cleanUrl = url.split('?')[0]
  const match = cleanUrl.match(/vimeo\.com\/(\d+)/)
  return match ? match[1] : null
}

// Fonction pour extraire l'ID YouTube
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

export default function VideoPlayer({
  src,
  className = '',
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
  disableDownload = false,
  allowFullscreen = true,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const videoType = getVideoType(src)

  useEffect(() => {
    // Pour les vidéos locales, s'assurer que autoplay fonctionne
    if (videoType === 'local' && videoRef.current && autoPlay) {
      videoRef.current.play().catch(() => {
        // Ignorer les erreurs d'autoplay
      })
    }

    // Empêcher le téléchargement via les contrôles (mais permettre fullscreen)
    if (videoRef.current && disableDownload) {
      const controlsList = allowFullscreen 
        ? 'nodownload noremoteplayback' 
        : 'nodownload nofullscreen noremoteplayback'
      videoRef.current.setAttribute('controlsList', controlsList)
      videoRef.current.disablePictureInPicture = true
    }
  }, [videoType, autoPlay, disableDownload, allowFullscreen])

  // Vimeo Embed avec fond transparent
  if (videoType === 'vimeo') {
    const vimeoId = getVimeoId(src)
    if (!vimeoId) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
          <p>URL Vimeo invalide</p>
        </div>
      )
    }

    // Configuration Vimeo pour fond noir
    // transparent=1 rend le fond transparent, mais on force le noir avec le conteneur
    // background=1 active le mode background (pas de contrôles)
    const vimeoUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=${autoPlay ? 1 : 0}&loop=${loop ? 1 : 0}&muted=${muted ? 1 : 0}&background=1&controls=0&playsinline=1&transparent=1&color=000000`

    return (
      <div className="relative w-full h-full bg-black overflow-hidden" style={{ backgroundColor: '#000000' }}>
        <iframe
          src={vimeoUrl}
          className={`w-full h-full object-cover ${className}`}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%',
            backgroundColor: '#000000',
          }}
        />
      </div>
    )
  }

  // YouTube Embed
  if (videoType === 'youtube') {
    const youtubeId = getYouTubeId(src)
    if (!youtubeId) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gray-900 text-white">
          <p>URL YouTube invalide</p>
        </div>
      )
    }

    // Construire l'URL YouTube avec les paramètres appropriés pour qualité maximale
    const youtubeParams = new URLSearchParams({
      autoplay: autoPlay ? '1' : '0',
      mute: muted ? '1' : '0',
      controls: controls ? '1' : '0',
      playsinline: '1',
      rel: '0', // Ne pas afficher les vidéos suggérées
      modestbranding: '1', // Réduire le branding YouTube
      iv_load_policy: '3', // Masquer les annotations
      cc_load_policy: '0', // Pas de sous-titres par défaut
      showinfo: '0', // Masquer les infos de la vidéo
      vq: 'highres', // Forcer la meilleure qualité disponible (hd1080, hd720, highres)
      enablejsapi: '1', // Activer l'API JavaScript pour contrôler la qualité
    })

    // Pour la boucle, YouTube nécessite le paramètre playlist avec l'ID de la vidéo
    if (loop) {
      youtubeParams.append('loop', '1')
      youtubeParams.append('playlist', youtubeId)
    }

    // Activer fullscreen si demandé
    if (allowFullscreen) {
      youtubeParams.append('fs', '1')
    }

    const youtubeUrl = `https://www.youtube.com/embed/${youtubeId}?${youtubeParams.toString()}`

    return (
      <iframe
        id={`youtube-player-${youtubeId}`}
        src={youtubeUrl}
        className={`w-full h-full object-cover ${className}`}
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; encrypted-media"
        allowFullScreen
        loading="lazy"
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
      />
    )
  }

  // Vidéo locale (fichier MP4, etc.)
  return (
    <video
      ref={videoRef}
      className={`w-full h-full object-cover ${className}`}
      autoPlay={autoPlay}
      loop={loop}
      muted={muted}
      playsInline
      controls={controls}
      controlsList={disableDownload 
        ? (allowFullscreen ? 'nodownload noremoteplayback' : 'nodownload nofullscreen noremoteplayback')
        : undefined}
      disablePictureInPicture={disableDownload}
      onContextMenu={(e) => {
        if (disableDownload) {
          e.preventDefault()
        }
      }}
      onDragStart={(e) => {
        if (disableDownload) {
          e.preventDefault()
        }
      }}
    >
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  )
}