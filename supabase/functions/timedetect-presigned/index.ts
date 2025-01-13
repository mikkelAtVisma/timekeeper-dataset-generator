import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { timeDetectAuth } from "../_shared/timeDetectAuth.ts"

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

    // 1. Fetch an auth token for TimeDetect
    const authHeaders = await timeDetectAuth.getAuthHeaders()

    // 2. For demonstration, we'll use a hard-coded tenantId here. 
    //    Adjust as needed or parse from request (e.g., query string) 
    //    if different tenants must be supported.
    const tenantId = "time.reg.benchmark"

    // 3. Call the TimeDetect presigned_url endpoint
    const presignedResponse = await fetch(
      'https://api.machine-learning-factory.stage.visma.com/td/presigned_url',
      {
        method: 'GET',
        headers: {
          ...authHeaders,          // includes Authorization: Bearer <token>
          tenantId,                // TimeDetect requires a tenantId header
        },
      }
    )

    if (!presignedResponse.ok) {
      const errorMsg = await presignedResponse.text()
      throw new Error(`Presigned URL request failed: ${errorMsg}`)
    }

    // 4. The response should contain something like { jobId, url }, etc.
    const data = await presignedResponse.json()

    // 5. Return the data as JSON, along with CORS headers
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