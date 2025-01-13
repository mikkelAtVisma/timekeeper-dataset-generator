import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
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
    console.log('Presigned URL Request Details:', {
      method: req.method,
      path: new URL(req.url).pathname,
      headers: Object.fromEntries(req.headers.entries()),
      timestamp: new Date().toISOString()
    })

    console.log('Requesting presigned URL from TimeDetect API...')
    
    const baseUrl = 'https://api.machine-learning-factory.stage.visma.com/td'
    const headers = await timeDetectAuth.getAuthHeaders()

    console.log('Making request to TimeDetect API with headers:', {
      ...headers,
      tenantId: 'time.reg.benchmark'
    })

    const response = await fetch(`${baseUrl}/presigned_url`, {
      headers: {
        ...headers,
        'tenantId': 'time.reg.benchmark',
      },
    })

    const data = await response.json()
    console.log('TimeDetect API Response:', data)

    if (!response.ok) {
      console.error('Failed to get presigned URL:', data)
      throw new Error(`Failed to get presigned URL: ${data.message || response.statusText}`)
    }

    // Create Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    console.log('Storing job information in database...')
    
    // Store the job information
    const { error: dbError } = await supabase
      .from('timedetect_jobs')
      .insert({
        job_id: data.jobId,
        presigned_url: data.url,
        dataset_id: crypto.randomUUID(),
        customer_id: crypto.randomUUID(),
      })

    if (dbError) {
      console.error('Error storing job information:', dbError)
      throw new Error('Failed to store job information')
    }

    console.log('Successfully stored job information')

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in timedetect-presigned function:', error)
    return new Response(
      JSON.stringify({ status: 'error', error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})