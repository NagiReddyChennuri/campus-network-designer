/**
 * API communication layer with Python backend HTTP server.
 */

const API_BASE_URL = "http://localhost:8000";

/**
 * Sends the current campus graph (buildings and connections) to Python backend to compute MST using Kruskal's algorithm.
 */
export async function calculateMST(buildings, connections) {
  try {
    const response = await fetch(`${API_BASE_URL}/mst`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        buildings,
        connections,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || `Server responded with status ${response.status}`,
      };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: `Could not connect to Python backend (${error.message}). Please ensure 'python server.py' is running on port 8000.`,
    };
  }
}

/**
 * Check health of the Python backend.
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (response.ok) {
      const data = await response.json();
      return { online: true, data };
    }
    return { online: false };
  } catch {
    return { online: false };
  }
}
