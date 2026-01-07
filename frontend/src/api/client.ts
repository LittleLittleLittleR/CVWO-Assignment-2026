// import { User, Topic, Post, Comment } from 

const API_BASE_URL = "http://localhost:8080/api";

// Helper to handle the top-level response structure
async function fetchClient<T>(method: string, endpoint: string, body?: any): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      "Content-Type": "application/json"
    },
  });

  const json = await res.json();

  if (!res.ok) {
    const errorMessage = json.payload?.message || json.payload?.details || "An error occurred";
    throw new Error(errorMessage);
  }
  return json.payload.data as T;
}