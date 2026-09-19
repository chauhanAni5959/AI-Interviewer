import api from "../utils/axios";

export const getLatestRoadmap = async () => {
  const response = await api.get("/api/roadmap/latest");
  return response.data;
};

export const generateRoadmap = async (payload) => {
  const response = await api.post("/api/roadmap/generate", payload);
  return response.data;
};
