import { useEffect, useState } from 'react';
import type { Announcement, BannerProps } from '@repo/ui/banner';
import { Banner } from '@repo/ui/banner';
import { fetchLatestAnnouncement, type AnnouncementSource } from './fetch-latest-announcement';

export interface AnnouncementBannerProps
  extends Omit<BannerProps, 'announcement'>, AnnouncementSource {}

/**
 * Shows the newest open announcement issue from a public GitHub repository as a Banner.
 * Renders nothing while loading, on error, or when no announcement is open.
 */
export const AnnouncementBanner = ({
  owner,
  repo,
  label,
  ...bannerProps
}: AnnouncementBannerProps) => {
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetchLatestAnnouncement({ owner, repo, label }, controller.signal)
      .then(setAnnouncement)
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        // A banner must never break the host page.
        console.warn('[announcements]', error instanceof Error ? error.message : error);
        setAnnouncement(null);
      });
    return () => controller.abort();
  }, [owner, repo, label]);

  if (!announcement) return null;
  return <Banner {...bannerProps} announcement={announcement} />;
};
