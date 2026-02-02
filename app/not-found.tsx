import Link from 'next/link'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: '404 - Page Not Found | AMEYA',
  description: 'The page you are looking for does not exist.',
}

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-8xl sm:text-9xl md:text-[12rem] font-bold mb-4 font-akira">
          404
        </h1>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold uppercase tracking-tight mb-6">
          Page Not Found
        </h2>
        <p className="text-base sm:text-lg text-white/60 mb-8 leading-relaxed">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          className="inline-block px-8 py-4 bg-white text-black font-medium uppercase tracking-wider hover:bg-white/90 transition-colors text-sm sm:text-base"
        >
          Back to Home
        </Link>
      </div>
    </main>
  )
}




