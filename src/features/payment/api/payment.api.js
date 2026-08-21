import apiClient from "../../../services/api.client";

export const createPayment = async(data)=>{
 const res = await apiClient.post(
  "/api/v1/payment/create",
  data
 );
 return res.data;
};
