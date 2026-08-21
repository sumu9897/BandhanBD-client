import apiClient from "../../../services/api.client";

export const getDashboard = async()=>{
 const res = await apiClient.get(
  "/api/v1/users/dashboard"
 );
 return res.data;
};
