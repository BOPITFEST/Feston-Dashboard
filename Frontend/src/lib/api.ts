export async function fetchReplacements() {
  const res = await fetch("http://localhost:5000/api/replacements");
  if (!res.ok) throw new Error("Failed to fetch replacements");
  return res.json();
}
