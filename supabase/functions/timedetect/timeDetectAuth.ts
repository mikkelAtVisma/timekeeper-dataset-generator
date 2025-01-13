export const timeDetectAuth = {
  async getAuthHeaders() {
    return {
      'Authorization': 'Bearer your-token-here',
      'Content-Type': 'application/json',
    }
  }
}