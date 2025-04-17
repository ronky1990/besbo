import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const generateCode = async (prompt, model, apiKey, provider) => {
  try {
    const response = await axios.post(`${API_URL}/generate`, {
      prompt,
      model,
      apiKey,
      provider
    });
    
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Failed to generate code');
    }
    throw new Error('Network error. Please check your connection.');
  }
}; 