import api from "./api";

export const getBusinesses = async () => {
  const response = await api.get("/api/businesses");
  return response.data;
};

export const createBusiness = async (businessData) => {
  const response = await api.post("/api/businesses", businessData);
  return response.data;
};

export const updateBusiness = async (id, businessData) => {
  const response = await api.put(`/api/businesses/${id}`, businessData);
  return response.data;
};

export const getBusinessQR = async (businessId) => {
  const response = await api.get(
    `/api/businesses/${businessId}/qr/download`,
    {
      responseType: "blob",
    }
  );

  return response.data;
};

export const updateBusinessStatus = async (id, status) => {
  const response = await api.patch(
    `/api/businesses/${id}/status`,
    null,
    {
      params: { status },
    }
  );

  return response.data;
};