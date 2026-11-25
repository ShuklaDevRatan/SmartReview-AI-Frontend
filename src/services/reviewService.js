import API from "./api";

export const getReviewSuggestions = async (qrCode) => {

  const response = await API.post(
    `/api/reviews/${qrCode}/suggestions`
  );

  return response.data;
};