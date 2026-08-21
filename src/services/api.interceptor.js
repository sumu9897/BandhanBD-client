import apiClient from "./api.client";

apiClient.interceptors.response.use(
 response => response,
 error => {
  if(error.response?.status === 401){
    console.log("Session expired");
  }
  return Promise.reject(error);
 }
);

export default apiClient;
