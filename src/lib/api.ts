const API_BASE = "http://localhost:8000/api";

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  // Set credentials for session cookie management
  options.credentials = "include";

  const headers = new Headers(options.headers || {});
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  options.headers = headers;

  const response = await fetch(url, options);

  if (!response.ok) {
    let errorMsg = "Something went wrong";
    try {
      const errJson = await response.json();
      errorMsg = errJson.error || errJson.detail || JSON.stringify(errJson);
    } catch {
      errorMsg = response.statusText;
    }
    throw new Error(errorMsg);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  return response.json();
}
