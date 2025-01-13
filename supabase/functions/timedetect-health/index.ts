import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { timeDetectAuth } from '../_shared/timeDetectAuth.ts'

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
    // Log request details
    console.log('Health Check Request Details:', {
      method: req.method,
      path: new URL(req.url).pathname,
      headers: Object.fromEntries(req.headers.entries()),
      timestamp: new Date().toISOString()
    })

    const baseUrl = 'https://api.machine-learning-factory.stage.visma.com/td'
    const headers = await timeDetectAuth.getAuthHeaders()

    console.log('Making health check request to TimeDetect API...')
    
    // Forward the request to TimeDetect API
    const response = await fetch(`${baseUrl}/health_check`, {
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    console.log('Health check response:', data)

    // If the response was successful, return the data with our expected format
    if (response.ok) {
      return new Response(
        JSON.stringify({ status: 'ok', data }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    } else {
      console.error('TimeDetect API returned error:', data)
      return new Response(
        JSON.stringify({ status: 'error', error: data }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status
        }
      )
    }
  } catch (error) {
    console.error('Error in timedetect-health function:', error)
    return new Response(
      JSON.stringify({ status: 'error', error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})