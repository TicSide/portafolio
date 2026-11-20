import snapshot from '@/data/repos.json';

export interface Repo {
  key: string;
  fullName: string;
  name: string;
  language: string;
  pushedAt: string;
  stars: number;
  url: string;
}

interface ApiRepo {
  pushed_at?: unknown;
  stargazers_count?: unknown;
}

/** Combina el dato guardado con la respuesta de la API, validando cada campo. */
export function mergeRepo(saved: Omit<Repo, 'url'>, api: ApiRepo | null): Repo {
  const pushedAt =
    api && typeof api.pushed_at === 'string' && !Number.isNaN(Date.parse(api.pushed_at))
      ? api.pushed_at
      : saved.pushedAt;
  const stars =
    api && typeof api.stargazers_count === 'number' && api.stargazers_count >= 0
      ? api.stargazers_count
      : saved.stars;
  return { ...saved, pushedAt, stars, url: `https://github.com/${saved.fullName}` };
}

async function fetchRepo(fullName: string): Promise<ApiRepo | null> {
  const headers: Record<string, string> = { Accept: 'application/vnd.github+json', 'User-Agent': 'portafolio-build' };
  const token = import.meta.env.GITHUB_TOKEN ?? process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    const response = await fetch(`https://api.github.com/repos/${fullName}`, {
      headers,
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) return null;
    return (await response.json()) as ApiRepo;
  } catch {
    return null;
  }
}

/**
 * Repos curados con datos frescos en build-time. Si la API falla o no hay red,
 * se usa el snapshot de src/data/repos.json: el sitio nunca depende de un backend.
 */
export async function getRepos(): Promise<{ repos: Repo[]; live: boolean }> {
  const results = await Promise.all(snapshot.map((saved) => fetchRepo(saved.fullName)));
  return {
    repos: snapshot.map((saved, index) => mergeRepo(saved, results[index] ?? null)),
    live: results.every((result) => result !== null),
  };
}
