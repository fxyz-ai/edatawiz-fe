import axios from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'https://edatawiz-be-7rdq.onrender.com';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Accept': 'application/json',
  },
  timeout: 90000, // 90s timeout to support Render cold starts and large dataset analysis
});
