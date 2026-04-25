import { NextRequest, NextResponse } from 'next/server'

/**
 * Price Alert API
 *
 * In production, replace the console.log with your email service:
 *   - Resend (recommended, free tier): https://resend.com
 *   - SendGrid: https://sendgrid.com
 *   - Nodemailer with Gmail
 *
 * Also store alerts in a database:
 *   - Supabase (free): https://supabase.com
 *   - PlanetScale (free): https://planetscale.com
 */

export async function POST(req: NextRequest) {
  try {
    const { email, product, target_price } = await req.json()

    if (!email || !product || !target_price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }

    // TODO: Save to your database here
    // Example with Supabase:
    // const { error } = await supabase.from('alerts').insert({ email, product, target_price })

    // TODO: Send confirmation email here
    // Example with Resend:
    // await resend.emails.send({
    //   from: 'alerts@dealfinder.ai',
    //   to: email,
    //   subject: `Alert set for ${product}`,
    //   html: `<p>We'll notify you when ${product} drops to ${target_price}.</p>`
    // })

    console.log(`Alert created: ${email} wants ${product} at ${target_price}`)

    return NextResponse.json({ success: true, message: 'Alert created successfully' })

  } catch (err) {
    console.error('Alert API error:', err)
    return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 })
  }
}
