import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
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

    // 3. Get TimeDetect auth headers
    const authHeaders = await timeDetectAuth.getAuthHeaders()
    console.log('Uploading data to presigned URL:', job.presigned_url)

    // 4. Upload the data to the presigned URL with correct headers
    const formattedDataset = {
      datasetId: datasetId,
      customerId: 'testing', // Assuming customer_id is a field in your dataset
      registrations: dataset.registrations.map(registration => ({
        registrationId: registration.id,
        date: registration.date,
        employeeId: registration.employee_id,
        projectId: registration.project_id,
        departmentId: registration.department_id,
        workCategory: registration.work_category,
        startTime: registration.start_time,
        endTime: registration.end_time,
        workDuration: registration.work_duration,
        breakDuration: registration.break_duration,
        publicHoliday: registration.public_holiday,
        numericals: registration.numericals // Assuming numericals is an array of objects
      }))
    }

    const response = await fetch(job.presigned_url, {
      method: 'PUT',
      headers: {
        ...authHeaders,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formattedDataset),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Upload failed:', response.status, errorText)
      throw new Error(`Failed to upload to presigned URL: ${response.statusText}. Status: ${response.status}. Error: ${errorText}`)
    }

    // 5. Update the job status and dataset_id
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