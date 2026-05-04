import axios from "axios";

export const getErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again.",
) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || fallback;
  }

  return error instanceof Error ? error.message : fallback;
};
