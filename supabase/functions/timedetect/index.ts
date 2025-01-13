import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { timeDetectAuth } from './timeDetectAuth.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const baseUrl = 'https://api.machine-learning-factory.stage.visma.com/td'
    const headers = await timeDetectAuth.getAuthHeaders()

    // Forward the request to TimeDetect API
    const response = await fetch(`${baseUrl}/health_check`, {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status
      }
    )
  } catch (error) {
    console.error('Error in timedetect function:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})