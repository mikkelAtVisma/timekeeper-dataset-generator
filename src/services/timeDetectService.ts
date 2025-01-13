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

      // Check both the status field and that we have data
      return data?.status === 'ok' && !!data;
    } catch (error) {
      console.error('Error testing TimeDetect connection:', error);
      return false;
    }
  }
}

export const timeDetectService = TimeDetectService.getInstance();