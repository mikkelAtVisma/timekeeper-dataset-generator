import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { timeDetectAuth } from "../_shared/timeDetectAuth.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

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
    console.log('Presigned URL requested')

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Fetch an auth token for TimeDetect
    const authHeaders = await timeDetectAuth.getAuthHeaders()

    // 2. Use the client_id as tenantId
    const tenantId = "time.reg.benchmark"

    // 3. Call the TimeDetect presigned_url endpoint
    const presignedResponse = await fetch(
      'https://api.machine-learning-factory.stage.visma.com/td/presigned_url',
      {
        method: 'GET',
        headers: {
          ...authHeaders,
          tenantId,
        },
      }
    )

    if (!presignedResponse.ok) {
      const errorMsg = await presignedResponse.text()
      throw new Error(`Presigned URL request failed: ${errorMsg}`)
    }

    // 4. Parse the response
    const data = await presignedResponse.json()
    console.log('Received presigned URL response:', data)

    // 5. Store the response in the database (without dataset_id)
    const { error: insertError } = await supabaseClient
      .from('timedetect_jobs')
      .insert({
        job_id: data.jobId,
        presigned_url: data.url,
        customer_id: tenantId,
        status: 'awaiting_dataset'
      })

    if (insertError) {
      console.error('Error storing job in database:', insertError)
      throw new Error('Failed to store job in database')
    }

    // 6. Return the data as JSON, along with CORS headers
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Presigned URL generation error:', error)

    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      },
    )
  }
})