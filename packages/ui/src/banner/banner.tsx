import { useState, type ComponentPropsWithRef } from 'react';
import { cx } from 'class-variance-authority';
import { buttonReset, focusRing } from '../lib/reset';
import { CloseIcon, ErrorIcon, InfoIcon, SuccessIcon, WarningIcon } from './icons';

export type AnnouncementType = 'success' | 'info' | 'warning' | 'error';

export interface AnnouncementText {
  title: string;
  description: string;
}

export interface Announcement {
  id: string;
  type: AnnouncementType;
  defaultLocale: string;
  translations: Record<string, AnnouncementText>;
}

export type BannerTranslator = (key: string) => string;

export interface BannerProps extends Omit<ComponentPropsWithRef<'div'>, 'role' | 'children'> {
  announcement: Announcement;
  locale: string;
  translator: BannerTranslator;
  // TODO: Do we need to remember? Do we need to store something in local/session-storage.
  onClose?: () => void;
}

const icons = {
  success: SuccessIcon,
  info: InfoIcon,
  warning: WarningIcon,
  error: ErrorIcon,
} as const;

const tones = {
  success: 'pcgl:bg-success-bg pcgl:border-success-border',
  info: 'pcgl:bg-info-bg pcgl:border-info-border',
  warning: 'pcgl:bg-warning-bg pcgl:border-warning-border',
  error: 'pcgl:bg-error-bg pcgl:border-error-border',
} as const;

const iconTones = {
  success: 'pcgl:text-success',
  info: 'pcgl:text-info',
  warning: 'pcgl:text-warning',
  error: 'pcgl:text-error',
} as const;

const focusMain = () => {
  const main = document.querySelector('main');
  if (!main) return;
  if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
  main.focus();
};

export const Banner = ({
  announcement,
  locale,
  translator,
  onClose,
  className,
  ...props
}: BannerProps) => {
  const [closedId, setClosedId] = useState<string | null>(null);
  const text =
    announcement.translations[locale] ?? announcement.translations[announcement.defaultLocale];
  if (closedId === announcement.id || !text) return null;

  const { type } = announcement;
  const Icon = icons[type];
  const urgent = type === 'error' || type === 'warning';

  const close = () => {
    focusMain();
    setClosedId(announcement.id);
    onClose?.();
  };

  return (
    <div
      {...props}
      role={urgent ? 'alert' : 'status'}
      aria-atomic
      className={cx(
        'pcgl-banner',
        `pcgl-banner-${type}`,
        'pcgl:grid pcgl:grid-cols-[0.75rem_auto_1fr_auto_0.75rem] pcgl:grid-rows-[1rem_auto_auto_1rem] pcgl:gap-x-3 pcgl:gap-y-2 pcgl:border-b pcgl:text-black',
        tones[type],
        className,
      )}
    >
      <Icon
        className={cx(
          'pcgl:col-start-2 pcgl:row-start-2 pcgl:self-center pcgl:text-xl',
          iconTones[type],
        )}
      />
      <strong className="pcgl:col-start-3 pcgl:row-start-2 pcgl:self-center pcgl:font-semibold">
        <span>{translator(`banner.type.${type}`)}: </span>
        {text.title}
      </strong>
      <p className="pcgl:col-start-3 pcgl:row-start-3 pcgl:text-sm">{text.description}</p>
      <button
        type="button"
        aria-label={translator('banner.close')}
        onClick={close}
        className={cx(
          buttonReset,
          focusRing,
          'pcgl:col-start-4 pcgl:row-start-2 pcgl:self-center pcgl:box-border pcgl:border pcgl:rounded-full pcgl:border-transparent pcgl:bg-transparent pcgl:hover:bg-red-50',
        )}
      >
        <CloseIcon />
      </button>
    </div>
  );
};
