import api from "../utils/axios";

export const getPricingPlans = async () => {
  const response = await api.get("/api/pricing/plans");
  return response.data;
};

export const createPricingOrder = async (planId) => {
  const response = await api.post("/api/pricing/orders", { planId });
  return response.data;
};

export const verifyPricingPayment = async (paymentDetails) => {
  const response = await api.post("/api/pricing/verify", paymentDetails);
  return response.data;
};
