import { NextRequest, NextResponse } from 'next/server'

// Configuration : clés API
// Resend : https://resend.com/api-keys
// reCAPTCHA v3 : https://www.google.com/recaptcha/admin
const RESEND_API_KEY = process.env.RESEND_API_KEY
const TO_EMAIL = process.env.CONTACT_EMAIL || 'contact@ameya.tv'
const RECAPTCHA_SECRET_KEY = process.env.RECAPTCHA_SECRET_KEY

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message, budget, honeypot, recaptchaToken } = body

    // Protection anti-spam : honeypot field
    if (honeypot) {
      return NextResponse.json(
        { success: true, message: 'Message sent successfully' },
        { status: 200 }
      )
    }

    // Validation reCAPTCHA (si configuré)
    if (RECAPTCHA_SECRET_KEY) {
      if (!recaptchaToken) {
        return NextResponse.json(
          { error: 'reCAPTCHA validation failed' },
          { status: 400 }
        )
      }

      try {
        const recaptchaResponse = await fetch('https://www.google.com/recaptcha/api/siteverify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `secret=${encodeURIComponent(RECAPTCHA_SECRET_KEY)}&response=${encodeURIComponent(
            recaptchaToken
          )}`,
        })

        const recaptchaData = await recaptchaResponse.json()

        if (
          !recaptchaData.success ||
          (typeof recaptchaData.score === 'number' && recaptchaData.score < 0.4)
        ) {
          console.warn('reCAPTCHA verification failed:', recaptchaData)
          return NextResponse.json(
            { error: 'reCAPTCHA verification failed' },
            { status: 400 }
          )
        }
      } catch (error) {
        console.error('reCAPTCHA verification error:', error)
        return NextResponse.json(
          { error: 'reCAPTCHA verification error' },
          { status: 500 }
        )
      }
    }

    // Validation des champs du formulaire
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validation email basique
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Si Resend n'est pas configuré, utiliser une alternative simple
    if (!RESEND_API_KEY) {
      // En développement, on peut juste logger
      if (process.env.NODE_ENV === 'development') {
        console.log('📧 Contact Form Submission:')
        console.log('Name:', name)
        console.log('Email:', email)
        console.log('Message:', message)
        console.log('Budget:', budget || 'Not specified')
        return NextResponse.json(
          { 
            success: true, 
            message: 'Message received (development mode - check console)',
            note: 'Configure RESEND_API_KEY in .env.local for production'
          },
          { status: 200 }
        )
      }

      // En production sans Resend, on peut utiliser un service alternatif
      // ou retourner une erreur
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      )
    }

    // Envoi avec Resend
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'AMEYA <contact@ameya.tv>', // Changez avec votre domaine vérifié
        to: [TO_EMAIL],
        subject: `New Contact Form Submission from ${name}`,
        html: `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Budget:</strong> ${budget || 'Not specified'}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `,
        text: `
          New Contact Form Submission
          
          Name: ${name}
          Email: ${email}
          Budget: ${budget || 'Not specified'}
          Message: ${message}
        `,
      }),
    })

    if (!resendResponse.ok) {
      const errorData = await resendResponse.json()
      console.error('Resend API Error:', errorData)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    const data = await resendResponse.json()

    return NextResponse.json(
      { success: true, message: 'Message sent successfully', id: data.id },
      { status: 200 }
    )
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}


