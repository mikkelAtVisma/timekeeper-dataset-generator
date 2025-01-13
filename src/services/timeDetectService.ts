import { supabase } from '../integrations/supabase/client';

export class TimeDetectService {
  private static instance: TimeDetectService;
  private readonly TIMEOUT = 10000; // 10 seconds timeout

  private constructor() {}

  static getInstance(): TimeDetectService {
    if (!TimeDetectService.instance) {
      TimeDetectService.instance = new TimeDetectService();
    }
    return TimeDetectService.instance;
  }

  async testConnection(): Promise<boolean> {
    try {
      console.log('Testing TimeDetect connection...');

      // Fire off the Supabase function request, racing against a timeout
      const { error } = await Promise.race([
        supabase.functions.invoke('timedetect-health', {
          method: 'GET',
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Connection timeout')), this.TIMEOUT)
        )
      ]) as { data?: any; error?: any };

      // If there's an error, log it and return false
      if (error) {
        console.error('Error testing TimeDetect connection:', error);
        return false;
      }

      console.log('TimeDetect health check succeeded');
      // If no error, the call was presumably 200 OK
      return true;
    } catch (err) {
      console.error('Error testing TimeDetect connection:', err);
      return false;
    }
  }

  async getPresignedUrl(): Promise<{ url: string; jobId: string; message: string }> {
    try {
      console.log('Requesting presigned URL...');

      const { data, error } = await Promise.race([
        supabase.functions.invoke('timedetect-presigned', {
          method: 'GET',
        }),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Connection timeout')), this.TIMEOUT)
        )
      ]) as { data?: any; error?: any };

      if (error) {
        console.error('Error getting presigned URL:', error);
        throw error;
      }

      console.log('Presigned URL response:', data);
      return data;
    } catch (err) {
      console.error('Error getting presigned URL:', err);
      throw err;
    }
  }
}

export const timeDetectService = TimeDetectService.getInstance();