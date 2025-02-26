import axios from "axios";

const baseURL = "https://interview.switcheo.com";

const axiosClient = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});
const apiClient = {
  get: async (url: string): Promise<any> => {
    const response = await axiosClient.get(url);
    return response;
  },

  post: async (url: string, body: any): Promise<any> => {
    const response = await axiosClient.post(url, body);
    return response;
  },
};

export default apiClient;

