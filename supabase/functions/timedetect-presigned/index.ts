import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { timeDetectAuth } from "../_shared/timeDetectAuth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Log incoming request
  console.log(`Incoming presigned URL request: ${req.method} ${req.url}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth headers
    console.log('Getting TimeDetect auth headers...');
    const headers = await timeDetectAuth.getAuthHeaders();
    console.log('Auth headers received successfully');

    // Make request to TimeDetect presigned URL endpoint
    console.log('Making request to TimeDetect presigned URL endpoint...');
    const response = await fetch('https://api.timedetect.com/presigned', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        tenantId: 'time.reg.benchmark',
        jobId: crypto.randomUUID()
      })
    });

    const data = await response.json();
    console.log('TimeDetect presigned URL response:', data);

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error getting presigned URL:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});