import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { timeDetectAuth } from "../_shared/timeDetectAuth.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Log incoming request
  console.log(`Incoming health check request: ${req.method} ${req.url}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get auth headers
    console.log('Getting TimeDetect auth headers...');
    const headers = await timeDetectAuth.getAuthHeaders();
    console.log('Auth headers received successfully');

    // Make request to TimeDetect health endpoint
    console.log('Making request to TimeDetect health endpoint...');
    const response = await fetch('https://api.timedetect.com/health', {
      method: 'GET',
      headers
    });

    if (!response.ok) {
      throw new Error(`TimeDetect API responded with status: ${response.status}`);
    }

    const data = await response.json();
    console.log('TimeDetect health response:', data);

    return new Response(
      JSON.stringify({ status: 'ok', data }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  } catch (error) {
    console.error('Error in health check:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Failed to check TimeDetect health status'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        }
      }
    );
  }
});