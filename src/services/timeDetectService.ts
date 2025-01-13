import { supabase } from '../integrations/supabase/client';

export class TimeDetectService {
  private static instance: TimeDetectService;

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
      const { data, error } = await supabase.functions.invoke('timedetect', {
        method: 'GET',
      });

      console.log('TimeDetect response:', { data, error });

      if (error) {
        console.error('Error testing TimeDetect connection:', error);
        return false;
      }

      return data?.status === 'ok' && !!data;
    } catch (error) {
      console.error('Error testing TimeDetect connection:', error);
      return false;
    }
  }

  async getPresignedUrl(): Promise<{ url: string; jobId: string; message: string }> {
    const { data, error } = await supabase.functions.invoke('timedetect', {
      method: 'GET',
      path: 'presigned_url',
    });

    if (error) {
      console.error('Error getting presigned URL:', error);
      throw error;
    }

    return data;
  }
}

export const timeDetectService = TimeDetectService.getInstance();