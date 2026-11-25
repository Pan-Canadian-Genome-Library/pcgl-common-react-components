import type { Announcement } from '@repo/ui/banner';
import { issueToAnnouncement, type GithubIssue } from './parse-issue';

export interface AnnouncementSource {
  /** GitHub user or organization that owns the repository, e.g. `Pan-Canadian-Genome-Library`. */
  owner: string;
  /** Public repository whose issues hold the announcements. */
  repo: string;
  /** Label the issue form adds to announcement issues. */
  label?: string;
}

export const defaultLabel = 'announcement';

const cacheTtlMs = 5 * 60_000;

export const latestIssuesUrl = ({ owner, repo, label = defaultLabel }: AnnouncementSource) => {
  const query = new URLSearchParams({
    labels: label,
    state: 'open',
    sort: 'created',
    direction: 'desc',
    per_page: '1',
  });
  return `https://api.github.com/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo)}/issues?${query}`;
};

const readCache = (key: string): { data: Announcement | null } | undefined => {
  try {
    const raw = sessionStorage.getItem(key);
    if (!raw) return undefined;
    const { at, data } = JSON.parse(raw) as { at: number; data: Announcement | null };
    return Date.now() - at < cacheTtlMs ? { data } : undefined;
  } catch {
    return undefined; // storage unavailable or corrupt: fetch instead
  }
};

const writeCache = (key: string, data: Announcement | null) => {
  try {
    sessionStorage.setItem(key, JSON.stringify({ at: Date.now(), data }));
  } catch {
    // quota or privacy-mode errors: skip caching
  }
};

/**
 * The newest open announcement issue that a trusted author wrote and that parses, or null when there is none.
 */
export const fetchLatestAnnouncement = async (
  source: AnnouncementSource,
  signal?: AbortSignal,
): Promise<Announcement | null> => {
  const url = latestIssuesUrl(source);
  const cacheKey = `pcgl-announcements:${url}`;
  const cached = readCache(cacheKey);
  if (cached) return cached.data;

  const response = await fetch(url, {
    signal,
    headers: { Accept: 'application/vnd.github+json' },
  });
  if (response.status === 403 || response.status === 429) {
    throw new Error('GitHub rate limit reached');
  }
  if (!response.ok) throw new Error(`GitHub responded ${response.status}`);

  const issues = (await response.json()) as GithubIssue[];
  let announcement: Announcement | null = null;
  for (const issue of issues) {
    announcement = issueToAnnouncement(issue);
    if (announcement) break;
  }
  writeCache(cacheKey, announcement);
  return announcement;
};
