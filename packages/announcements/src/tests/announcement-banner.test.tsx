import '@testing-library/jest-dom/vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { axe } from 'jest-axe';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AnnouncementBanner } from '..';
import { makeIssue } from './fixtures';

const messages: Record<string, string> = {
  'banner.close': 'Close announcement',
  'banner.type.warning': 'Warning',
};
const translator = (key: string) => messages[key] ?? key;

const props = { owner: 'Pan-Canadian-Genome-Library', repo: 'announcements', translator };

const respondWith = (body: unknown, status = 200) =>
  vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify(body), { status })));

describe('@repo/announcements AnnouncementBanner', () => {
  beforeEach(() => sessionStorage.clear());
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('shows the newest open announcement in the requested locale', async () => {
    respondWith([makeIssue()]);
    const { container } = render(<AnnouncementBanner {...props} locale="fr" />);

    expect(await screen.findByText('Maintenance planifiée')).toBeVisible();
    expect(screen.getByRole('alert')).toHaveTextContent('Warning:');
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders nothing when no announcement is open', async () => {
    respondWith([]);
    const { container } = render(<AnnouncementBanner {...props} locale="en" />);

    await waitFor(() => expect(fetch).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });

  it('renders nothing and warns when GitHub fails', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    respondWith({}, 500);
    const { container } = render(<AnnouncementBanner {...props} locale="en" />);

    await waitFor(() => expect(warn).toHaveBeenCalled());
    expect(container).toBeEmptyDOMElement();
  });
});
