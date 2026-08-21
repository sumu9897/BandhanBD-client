import apiClient from "../../../services/api.client";

export const askAI = async(message)=>{
 const res = await apiClient.post(
  "/api/v1/ai/chat",
  {message}
 );
 return res.data;
};

export const getRecommendations = async()=>{
 const res = await apiClient.get(
  "/api/v1/ai/recommendations"
 );
 return res.data;
};
