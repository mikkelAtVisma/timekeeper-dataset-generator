interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

export const timeDetectAuth = {
  async getAuthHeaders(): Promise<Record<string, string>> {
    try {
      const params = new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: 'time.reg.benchmark',
        scope: 'machine-learning-factory-api-stage:td',
        client_secret: 'tFmPipbdSzhljVegeGtzlfss3gAu0QyfeDl4ODXGBefa3BauGUIIrEQeNVoll0dx'
      });

      console.log('Requesting TimeDetect token...');
      
      const response = await fetch('https://connect.identity.stagaws.visma.com/connect/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        body: params
      });

      if (!response.ok) {
        throw new Error('Failed to get TimeDetect token');
      }

      const data: TokenResponse = await response.json();
      console.log('Token received successfully');
      
      return {
        'Authorization': `Bearer ${data.access_token}`,
        'Content-Type': 'application/json'
      };
    } catch (error) {
      console.error('Error getting TimeDetect token:', error);
      throw error;
    }
  }
}