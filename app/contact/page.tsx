'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function ContactPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    budget: '',
    honeypot: '', // Protection anti-spam
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
  }>({ type: null, message: '' })

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: 'Message sent successfully! I\'ll get back to you soon.',
        })
        // Réinitialiser le formulaire
        setFormData({
          name: '',
          email: '',
          message: '',
          budget: '',
          honeypot: '',
        })
      } else {
        setSubmitStatus({
          type: 'error',
          message: data.error || 'Failed to send message. Please try again.',
        })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'An error occurred. Please try again later.',
      })
    } finally {
      setIsSubmitting(false)
      // Effacer le message après 5 secondes
      setTimeout(() => {
        setSubmitStatus({ type: null, message: '' })
      }, 5000)
    }
  }

  return (
    <main className="min-h-screen bg-white text-black">
      {/* Header Simple - Style donprod avec fond blanc */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-sm border-b border-black/10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4">
          <div className="flex items-center justify-between">
            {/* Logo gauche */}
            <Link href="/" className="text-base sm:text-lg md:text-xl uppercase tracking-tight font-bold font-akira text-black">
              AMEYA
            </Link>

            {/* Icône Menu Hamburger */}
            <button
              onClick={toggleMenu}
              className="flex flex-col gap-1.5 w-6 h-6 justify-center items-center z-50 relative"
              aria-label="Toggle menu"
            >
              <motion.span
                className="block w-6 h-0.5 bg-black"
                animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="block w-6 h-0.5 bg-black"
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="block w-6 h-0.5 bg-black"
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
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-2xl"
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
                      className="block text-2xl font-medium tracking-[0.2em] uppercase transition-colors text-black hover:opacity-70"
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
                      className="block text-2xl font-medium tracking-[0.2em] uppercase transition-colors text-black hover:opacity-70"
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
                      className="block text-2xl font-medium tracking-[0.2em] uppercase transition-colors text-black hover:opacity-70"
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
      <div className="pt-32 sm:pt-40 pb-20 sm:pb-32 px-6 sm:px-8 lg:px-12">
        <div className="max-w-7xl mx-auto">
          {/* Titre Principal */}
          <motion.div
            className="text-center mb-16 sm:mb-24"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold uppercase tracking-tight mb-4">
              CONTACT
            </h1>
          </motion.div>

          {/* Grid Contact Info et Formulaire */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 sm:gap-16">
            {/* Contact Info - Colonne gauche */}
            <motion.div
              className="space-y-8"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <div>
                <p className="text-base sm:text-lg text-black/70 leading-relaxed mb-8">
                Ready to elevate your next project? I’m currently accepting new commissions and creative collaborations. Let’s build something unforgettable together.
                </p>
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-xs sm:text-sm uppercase tracking-wider text-black/60 block mb-3">
                    EMAIL
                  </span>
                  <a
                    href="mailto:contact@ameyaprod.com"
                    className="text-base sm:text-lg md:text-xl uppercase tracking-wider font-medium text-black hover:opacity-70 transition-opacity"
                  >
                    CONTACT@AMEYA.TV
                  </a>
                </div>

                <div>
                  <span className="text-xs sm:text-sm uppercase tracking-wider text-black/60 block mb-3">
                    SOCIAL
                  </span>
                  <div className="flex flex-col gap-3">
                    <a
                      href="https://www.instagram.com/ameya.films/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base sm:text-lg md:text-xl uppercase tracking-wider font-medium text-black hover:opacity-70 transition-opacity"
                    >
                      INSTAGRAM
                    </a>
                    <a
                      href="https://tiktok.com/@ameyaprod"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-base sm:text-lg md:text-xl uppercase tracking-wider font-medium text-black hover:opacity-70 transition-opacity"
                    >
                      TIKTOK
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form - Colonne droite */}
            <motion.form
              onSubmit={handleSubmit}
              className="space-y-6"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              {/* Honeypot field (caché pour les bots) */}
              <input
                type="text"
                name="website"
                value={formData.honeypot}
                onChange={(e) =>
                  setFormData({ ...formData, honeypot: e.target.value })
                }
                className="hidden"
                tabIndex={-1}
                autoComplete="off"
              />

              <div>
                <label
                  htmlFor="name"
                  className="block text-xs sm:text-sm uppercase tracking-wider text-black/60 mb-3"
                >
                  NAME
                </label>
                <input
                  type="text"
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-black/20 px-0 py-3 focus:outline-none focus:border-black transition-colors text-base sm:text-lg"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-xs sm:text-sm uppercase tracking-wider text-black/60 mb-3"
                >
                  EMAIL
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-black/20 px-0 py-3 focus:outline-none focus:border-black transition-colors text-base sm:text-lg"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-xs sm:text-sm uppercase tracking-wider text-black/60 mb-3"
                >
                  DESCRIBE YOUR PROJECT
                </label>
                <textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) =>
                    setFormData({ ...formData, message: e.target.value })
                  }
                  rows={6}
                  className="w-full bg-transparent border-b border-black/20 px-0 py-3 focus:outline-none focus:border-black transition-colors resize-none text-base sm:text-lg"
                  required
                  disabled={isSubmitting}
                />
              </div>

              <div>
                <label
                  htmlFor="budget"
                  className="block text-xs sm:text-sm uppercase tracking-wider text-black/60 mb-3"
                >
                  BUDGET
                </label>
                <input
                  type="text"
                  id="budget"
                  value={formData.budget}
                  onChange={(e) =>
                    setFormData({ ...formData, budget: e.target.value })
                  }
                  className="w-full bg-transparent border-b border-black/20 px-0 py-3 focus:outline-none focus:border-black transition-colors text-base sm:text-lg"
                  placeholder="€"
                  disabled={isSubmitting}
                />
              </div>

              {/* Message de statut */}
              <AnimatePresence>
                {submitStatus.type && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 text-sm ${
                      submitStatus.type === 'success'
                        ? 'bg-green-50 text-green-800 border border-green-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {submitStatus.message}
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="submit"
                disabled={isSubmitting}
                className="mt-8 px-8 py-4 bg-black text-white font-medium uppercase tracking-wider hover:bg-black/80 transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'SENDING...' : 'SEND MESSAGE'}
              </button>
            </motion.form>
          </div>
        </div>
      </div>
    </main>
  )
}

