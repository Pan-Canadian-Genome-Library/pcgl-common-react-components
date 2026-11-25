import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchLatestAnnouncement, latestIssuesUrl } from '../fetch-latest-announcement';
import { makeIssue } from './fixtures';

const source = { owner: 'Pan-Canadian-Genome-Library', repo: 'announcements' };

const respondWith = (body: unknown, status = 200) =>
  vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status }));

describe('fetchLatestAnnouncement', () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => vi.unstubAllGlobals());

  it('queries the newest open issues with the announcement label', () => {
    const url = new URL(latestIssuesUrl(source));
    expect(url.pathname).toBe('/repos/Pan-Canadian-Genome-Library/announcements/issues');
    expect(url.searchParams.get('labels')).toBe('announcement');
    expect(url.searchParams.get('state')).toBe('open');
    expect(url.searchParams.get('sort')).toBe('created');
    expect(url.searchParams.get('direction')).toBe('desc');
  });

  it('returns the first issue that is trusted and parses', async () => {
    vi.stubGlobal(
      'fetch',
      respondWith([
        makeIssue({ number: 3, author_association: 'NONE' }),
        makeIssue({ number: 2 }),
        makeIssue({ number: 1 }),
      ]),
    );
    expect((await fetchLatestAnnouncement(source))?.id).toBe('2');
  });

  it('returns null when no issue is open', async () => {
    vi.stubGlobal('fetch', respondWith([]));
    expect(await fetchLatestAnnouncement(source)).toBeNull();
  });

  it('serves a repeat call from sessionStorage', async () => {
    const fetchMock = respondWith([makeIssue()]);
    vi.stubGlobal('fetch', fetchMock);
    await fetchLatestAnnouncement(source);
    await fetchLatestAnnouncement(source);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('refetches once the cache has expired', async () => {
    vi.useFakeTimers();
    const fetchMock = vi.fn(() => Promise.resolve(new Response(JSON.stringify([]))));
    vi.stubGlobal('fetch', fetchMock);
    await fetchLatestAnnouncement(source);
    vi.advanceTimersByTime(5 * 60_000 + 1);
    await fetchLatestAnnouncement(source);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    vi.useRealTimers();
  });

  it('throws on a rate limit or server error', async () => {
    vi.stubGlobal('fetch', respondWith({ message: 'rate limit' }, 403));
    await expect(fetchLatestAnnouncement(source)).rejects.toMatchObject({
      message: 'GitHub rate limit reached',
    });

    vi.stubGlobal('fetch', respondWith({}, 500));
    await expect(fetchLatestAnnouncement(source)).rejects.toMatchObject({
      message: 'GitHub responded 500',
    });
  });
});
