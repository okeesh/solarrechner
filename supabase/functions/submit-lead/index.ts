import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { Resend } from 'https://esm.sh/resend@3.2.0'
import { corsHeaders } from '../_shared/cors.ts'

// Definition der erwarteten Daten vom Client
interface LeadPayload {
  apiKey: string
  customer_name: string
  customer_email: string
  potential_savings: number
  // Hier könnten weitere Daten aus dem Rechner hinzukommen
}

// Initialisiere Resend mit dem API-Schlüssel aus den Umgebungsvariablen
const resend = new Resend(Deno.env.get('RESEND_API_KEY'))

serve(async (req) => {
  // CORS Preflight-Request behandeln
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const payload: LeadPayload = await req.json()
    const { apiKey, customer_name, customer_email, potential_savings } = payload

    // Erstelle einen Supabase-Client mit Admin-Rechten
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // 1. Finde das Profil basierend auf dem API-Schlüssel
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, company_name, logo_url, website_url')
      .eq('api_key', apiKey)
      .single()

    if (profileError || !profile) {
      console.error('Profile error:', profileError)
      return new Response(JSON.stringify({ error: 'Ungültiger API-Schlüssel.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      })
    }

    // 2. Erstelle den Lead-Eintrag in der Datenbank
    const { error: leadError } = await supabaseAdmin.from('leads').insert({
      user_id: profile.id,
      customer_name,
      customer_email,
      potential_savings,
    })

    if (leadError) {
      console.error('Lead insert error:', leadError)
      throw new Error('Fehler beim Speichern des Leads.')
    }

    // 3. Sende E-Mail an den Kunden
    const senderEmail = Deno.env.get('SENDER_EMAIL')
    if (!senderEmail) {
      throw new Error('SENDER_EMAIL environment variable not set.')
    }

    await resend.emails.send({
      from: `${profile.company_name || 'Solarrechner'} <${senderEmail}>`,
      to: customer_email,
      subject: 'Ihre personalisierte Solaranalyse',
      html: `
        <html>
          <body>
            <h1>Hallo ${customer_name},</h1>
            <p>vielen Dank für Ihr Interesse an einer Solaranlage. Hier ist Ihre personalisierte Schätzung:</p>
            <p><strong>Potenzielle jährliche Ersparnis:</strong> ${potential_savings.toFixed(2)} €</p>
            <p>Wir werden uns in Kürze mit Ihnen in Verbindung setzen, um die nächsten Schritte zu besprechen.</p>
            <hr>
            <p>Mit freundlichen Grüßen,</p>
            <p>${profile.company_name || ''}</p>
            ${profile.logo_url ? `<img src="${profile.logo_url}" alt="Firmenlogo" style="max-width: 150px;"/>` : ''}
            <br>
            ${profile.website_url ? `<a href="${profile.website_url}">${profile.website_url}</a>` : ''}
          </body>
        </html>
      `,
    })

    return new Response(JSON.stringify({ message: 'Lead erfolgreich erstellt und E-Mail versandt.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})