// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://myapedwslmipqgngeamd.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15YXBlZHdzbG1pcHFnbmdlYW1kIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzY3NzEyNjgsImV4cCI6MjA1MjM0NzI2OH0.jO7R8s1fC-wufmj51s5FrEgRzNKxR-FTqXMmYbjXYWE";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);