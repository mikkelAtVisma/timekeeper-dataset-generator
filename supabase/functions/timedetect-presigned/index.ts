import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

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
    
    // Generate a unique job ID
    const jobId = crypto.randomUUID()
    
    // For now, return a mock presigned URL
    // In a real implementation, this would generate a proper presigned URL
    const presignedUrl = `https://timedetect-mock-url/${jobId}`
    
    return new Response(
      JSON.stringify({ 
        jobId,
        url: presignedUrl,
        message: "Presigned URL generated successfully" 
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200 
      },
    )
  } catch (error) {
    console.error('Presigned URL generation error:', error)
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500
      },
    )
  }
})