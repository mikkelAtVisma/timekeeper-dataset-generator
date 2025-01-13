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
      const { data, error } = await supabase.functions.invoke('timedetect', {
        method: 'GET',
      });

      if (error) {
        console.error('Error testing TimeDetect connection:', error);
        return false;
      }

      return data?.status === 'ok' || false;
    } catch (error) {
      console.error('Error testing TimeDetect connection:', error);
      return false;
    }
  }
}

export const timeDetectService = TimeDetectService.getInstance();