import axios from "axios";

const LOOPBACK_HOSTS = new Set(["127.0.0.1", "localhost"]);

const getDefaultApiUrl = () => {
  if (typeof window === "undefined") {
    return "http://127.0.0.1:5000";
  }

  const protocol = window.location.protocol === "https:" ? "https:" : "http:";
  return `${protocol}//${window.location.hostname}:5000`;
};

const alignLoopbackHostname = (rawUrl) => {
  if (typeof window === "undefined") {
    return rawUrl;
  }

  try {
    const apiUrl = new URL(rawUrl);
    const frontendHost = window.location.hostname;

    if (
      LOOPBACK_HOSTS.has(apiUrl.hostname) &&
      LOOPBACK_HOSTS.has(frontendHost) &&
      apiUrl.hostname !== frontendHost
    ) {
      apiUrl.hostname = frontendHost;
    }

    return apiUrl.toString();
  } catch {
    return rawUrl;
  }
};

const configuredBaseUrl =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  getDefaultApiUrl();

const normalizedBaseUrl = alignLoopbackHostname(configuredBaseUrl)
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

const api = axios.create({
  baseURL: normalizedBaseUrl,
  withCredentials: true,
});

export default api;
