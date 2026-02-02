'use client'

import { useState } from 'react'
import LoadingScreen from './LoadingScreen'

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  const handleLoadingComplete = () => {
    setIsLoading(false)
  }

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      {!isLoading && (
        <div className="animate-fadeIn min-h-screen flex flex-col">
          {children}
        </div>
      )}
    </>
  )
}

