interface TokenResponse {
  access_token: string;
  expires_in: number;
  token_type: string;
}

class TimeDetectAuth {
  private static instance: TimeDetectAuth;
  private token: string | null = null;
  private tokenExpiry: Date | null = null;

  private constructor() {}

  static getInstance(): TimeDetectAuth {
    if (!TimeDetectAuth.instance) {
      TimeDetectAuth.instance = new TimeDetectAuth();
    }
    return TimeDetectAuth.instance;
  }

  async getToken(): Promise<string> {
    if (this.token && this.tokenExpiry && this.tokenExpiry > new Date()) {
      return this.token;
    }

    const params = new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: 'time.reg.benchmark',
      scope: 'machine-learning-factory-api-stage:td',
      client_secret: 'tFmPipbdSzhljVegeGtzlfss3gAu0QyfeDl4ODXGBefa3BauGUIIrEQeNVoll0dx'
    });

    try {
      const response = await fetch('https://connect.identity.stagaws.visma.com/connect/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'Origin': window.location.origin,
        },
        mode: 'cors',
        credentials: 'include',
        body: params
      });

      if (!response.ok) {
        throw new Error('Failed to get TimeDetect token');
      }

      const data: TokenResponse = await response.json();
      this.token = data.access_token;
      this.tokenExpiry = new Date(Date.now() + (data.expires_in * 1000));
      
      return this.token;
    } catch (error) {
      console.error('Error getting TimeDetect token:', error);
      throw error;
    }
  }

  async getAuthHeaders(): Promise<HeadersInit> {
    const token = await this.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
}

export const timeDetectAuth = TimeDetectAuth.getInstance();