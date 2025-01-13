import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
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
    const { jobId, datasetId } = await req.json()
    console.log(`Uploading dataset ${datasetId} to TimeDetect job ${jobId}`)

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // 1. Get the dataset
    const { data: dataset, error: datasetError } = await supabaseClient
      .from('datasets')
      .select('*')
      .eq('id', datasetId)
      .single()

    if (datasetError || !dataset) {
      console.error('Error fetching dataset:', datasetError)
      throw new Error('Dataset not found')
    }

    // 2. Get the TimeDetect job
    const { data: job, error: jobError } = await supabaseClient
      .from('timedetect_jobs')
      .select('*')
      .eq('job_id', jobId)
      .single()

    if (jobError || !job) {
      console.error('Error fetching job:', jobError)
      throw new Error('Job not found')
    }

    // 3. Upload the data to the presigned URL
    const response = await fetch(job.presigned_url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataset.registrations),
    })

    if (!response.ok) {
      throw new Error(`Failed to upload to presigned URL: ${response.statusText}`)
    }

    // 4. Update the job status and dataset_id
    const { error: updateError } = await supabaseClient
      .from('timedetect_jobs')
      .update({
        status: 'uploaded',
        dataset_id: datasetId
      })
      .eq('job_id', jobId)

    if (updateError) {
      console.error('Error updating job:', updateError)
      throw new Error('Failed to update job status')
    }

    return new Response(
      JSON.stringify({ message: 'Upload successful' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Upload error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})