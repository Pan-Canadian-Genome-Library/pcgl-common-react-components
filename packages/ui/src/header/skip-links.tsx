import type { ComponentPropsWithRef, MouseEvent } from 'react';
import { cx } from 'class-variance-authority';
import { focusRing, listReset } from '../lib/reset';

export interface SkipLinkItem {
  href: `#${string}`;
  label: string;
}

export interface SkipLinksProps extends ComponentPropsWithRef<'ul'> {
  links: SkipLinkItem[];
}

const focusTarget = (event: MouseEvent<HTMLAnchorElement>, href: string) => {
  const target = document.getElementById(decodeURIComponent(href.slice(1)));
  if (!target) return;
  event.preventDefault();
  if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
  target.focus();
  target.scrollIntoView?.();
};

export const SkipLinks = ({ links, className, ...props }: SkipLinksProps) => {
  if (links.length === 0) return null;
  return (
    <ul {...props} className={cx('pcgl-skip-links', listReset, className)}>
      {links.map((link) => (
        <li key={link.href}>
          <a
            href={link.href}
            onClick={(event) => focusTarget(event, link.href)}
            className={cx(
              'pcgl-skip-link',
              focusRing,
              'pcgl:sr-only pcgl:focus:not-sr-only pcgl:focus:fixed pcgl:focus:top-2 pcgl:focus:left-2 pcgl:focus:z-[1001]',
              'pcgl:focus:rounded-md pcgl:focus:bg-white pcgl:focus:px-4 pcgl:focus:py-2 pcgl:focus:text-sm pcgl:focus:font-semibold pcgl:focus:shadow-md',
              'pcgl:focus:text-[color:var(--pcgl-header-brand,#761248)]',
            )}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
};
