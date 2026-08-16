const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:4000';

async function handleResponse(res) {
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const message = data && data.error ? data.error : `Request failed (${res.status})`;
    throw new Error(Array.isArray(message) ? message.join(', ') : message);
  }
  return data;
}

export async function fetchBrews(method) {
  const url = new URL(`${API_BASE}/api/brews`);
  if (method) url.searchParams.set('method', method);
  const res = await fetch(url);
  return handleResponse(res);
}

export async function createBrew(brew) {
  const res = await fetch(`${API_BASE}/api/brews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(brew),
  });
  return handleResponse(res);
}

export async function updateBrew(id, brew) {
  const res = await fetch(`${API_BASE}/api/brews/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(brew),
  });
  return handleResponse(res);
}

export async function deleteBrew(id) {
  const res = await fetch(`${API_BASE}/api/brews/${id}`, { method: 'DELETE' });
  return handleResponse(res);
}
