import { describe, expect, it } from 'vitest';
import { mergeRepo } from '@/lib/github';
import snapshot from '@/data/repos.json';
import { home } from '@/content';

const saved = { key: 'k', fullName: 'owner/repo', name: 'repo', language: 'Java', pushedAt: '2025-12-05T00:00:00Z', stars: 1 };

describe('datos de GitHub', () => {
  it('usa el snapshot cuando la API no responde', () => {
    expect(mergeRepo(saved, null)).toEqual({ ...saved, url: 'https://github.com/owner/repo' });
  });

  it('toma fecha y estrellas de la API cuando son válidas', () => {
    const repo = mergeRepo(saved, { pushed_at: '2026-01-02T03:04:05Z', stargazers_count: 7 });
    expect(repo.pushedAt).toBe('2026-01-02T03:04:05Z');
    expect(repo.stars).toBe(7);
  });

  it('ignora respuestas con campos inválidos', () => {
    const repo = mergeRepo(saved, { pushed_at: 'no-es-fecha', stargazers_count: -3 });
    expect(repo.pushedAt).toBe(saved.pushedAt);
    expect(repo.stars).toBe(saved.stars);
  });

  it('cada repo curado tiene descripción de rol en ambos idiomas', () => {
    for (const repo of snapshot) {
      expect(home.es.github.roles[repo.key]).toBeTruthy();
      expect(home.en.github.roles[repo.key]).toBeTruthy();
    }
  });
});
