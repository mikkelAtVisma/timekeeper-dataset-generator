import { timeDetectAuth } from '../utils/timeDetectAuth';

export class TimeDetectService {
  private static instance: TimeDetectService;
  private baseUrl = 'https://api.machine-learning-factory.stage.visma.com/td';

  private constructor() {}

  static getInstance(): TimeDetectService {
    if (!TimeDetectService.instance) {
      TimeDetectService.instance = new TimeDetectService();
    }
    return TimeDetectService.instance;
  }

  async testConnection(): Promise<boolean> {
    try {
      const headers = await timeDetectAuth.getAuthHeaders();
      const response = await fetch(`${this.baseUrl}/health_check`, {
        headers
      });
      return response.ok;
    } catch (error) {
      console.error('Error testing TimeDetect connection:', error);
      return false;
    }
  }
}

export const timeDetectService = TimeDetectService.getInstance();