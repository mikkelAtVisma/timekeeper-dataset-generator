import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log('TimeDetect health check requested')

    // 1. Call TimeDetect health_check endpoint (no authentication needed)
    const timeDetectResponse = await fetch(
      'https://api.machine-learning-factory.stage.visma.com/td/health_check',
      {
        method: 'GET'  // explicitly set GET
      }
    )

    if (!timeDetectResponse.ok) {
      const text = await timeDetectResponse.text()
      throw new Error(`TimeDetect health_check request failed: ${text}`)
    }

    // 2. Parse the returned JSON
    const data = await timeDetectResponse.json()

    // 3. Return the data, including CORS
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })
  } catch (error) {
    console.error('TimeDetect health check error:', error)

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})