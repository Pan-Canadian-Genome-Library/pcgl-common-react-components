import type { AnchorHTMLAttributes, MouseEvent, Ref } from 'react';
import { cx } from 'class-variance-authority';
import { focusRing } from '../lib/reset';
import { useHeaderContext } from './header-context';

export interface HeaderNavLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
  current?: boolean;
  ref?: Ref<HTMLAnchorElement>;
}

const isExternal = (href: string) => /^https?:\/\//.test(href);

export const HeaderNavLink = ({
  href,
  current = false,
  className,
  target,
  rel,
  onClick,
  ...props
}: HeaderNavLinkProps) => {
  const { linkComponent, closePanel } = useHeaderContext();
  const external = isExternal(href);
  const Link = external ? 'a' : linkComponent;
  const linkTarget = target ?? (external ? '_blank' : undefined);

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(event);
    closePanel();
  };

  return (
    <Link
      {...props}
      href={href}
      target={linkTarget}
      rel={rel ?? (linkTarget === '_blank' ? 'noreferrer' : undefined)}
      aria-current={current ? 'page' : props['aria-current']}
      onClick={handleClick}
      className={cx(
        'pcgl-header-nav-link',
        focusRing,
        'pcgl:inline-flex pcgl:items-center pcgl:rounded-sm pcgl:py-2 pcgl:text-sm pcgl:whitespace-nowrap pcgl:no-underline',
        'pcgl:text-[color:var(--pcgl-header-text,#000)] pcgl:hover:text-[color:var(--pcgl-header-brand,#761248)]',
        'pcgl:aria-[current=page]:font-semibold pcgl:aria-[current=page]:text-[color:var(--pcgl-header-brand,#761248)]',
        className,
      )}
    />
  );
};
