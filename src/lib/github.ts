// Minimal GitHub Contents API client used by /api/admin routes to commit new
// product data and photos straight to the repo. No dependency needed -- it's
// three small REST calls over the platform fetch.

const API_BASE = "https://api.github.com";

function repoSlug(): string {
  const repo = process.env.GITHUB_REPO; // e.g. "Russdawg/ChiefsCustomCalls"
  if (!repo) {
    throw new Error(
      "GITHUB_REPO is not set. Add it to your environment variables (see .env.local.example)."
    );
  }
  return repo;
}

function token(): string {
  const t = process.env.GITHUB_TOKEN;
  if (!t) {
    throw new Error(
      "GITHUB_TOKEN is not set. Add it to your environment variables (see .env.local.example)."
    );
  }
  return t;
}

function branch(): string {
  return process.env.GITHUB_BRANCH || "main";
}

function headers() {
  return {
    Authorization: `Bearer ${token()}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
}

/** Returns the current file's blob sha, or null if it doesn't exist yet. */
export async function getFileSha(path: string): Promise<string | null> {
  const res = await fetch(
    `${API_BASE}/repos/${repoSlug()}/contents/${encodeURI(path)}?ref=${branch()}`,
    { headers: headers(), cache: "no-store" }
  );
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`GitHub getFileSha failed (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { sha: string };
  return data.sha;
}

/**
 * Creates or updates a single file in the repo.
 * `contentBase64` must already be base64-encoded (works for text and binary).
 */
export async function putFile(
  path: string,
  contentBase64: string,
  message: string
): Promise<void> {
  const sha = await getFileSha(path);
  const res = await fetch(`${API_BASE}/repos/${repoSlug()}/contents/${encodeURI(path)}`, {
    method: "PUT",
    headers: { ...headers(), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: contentBase64,
      branch: branch(),
      ...(sha ? { sha } : {}),
    }),
  });
  if (!res.ok) {
    throw new Error(`GitHub putFile failed for ${path} (${res.status}): ${await res.text()}`);
  }
}

export async function getJsonFile<T>(path: string): Promise<T> {
  const res = await fetch(
    `${API_BASE}/repos/${repoSlug()}/contents/${encodeURI(path)}?ref=${branch()}`,
    { headers: headers(), cache: "no-store" }
  );
  if (!res.ok) {
    throw new Error(`GitHub getJsonFile failed for ${path} (${res.status}): ${await res.text()}`);
  }
  const data = (await res.json()) as { content: string };
  const decoded = Buffer.from(data.content, "base64").toString("utf-8");
  return JSON.parse(decoded) as T;
}
