const BACKEND_URL=import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";  
export async function fetchReplacements() {
  const res = await fetch(`${BACKEND_URL}/api/replacements`);
  if (!res.ok) throw new Error("Failed to fetch replacements");
  return res.json();
}
