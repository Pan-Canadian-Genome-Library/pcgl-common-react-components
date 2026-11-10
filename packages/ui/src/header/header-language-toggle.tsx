import type { ButtonHTMLAttributes, Ref } from 'react';
import { cx } from 'class-variance-authority';
import { headerButtonVariants } from './header-button';

export interface HeaderLanguageToggleProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  lang: string;
  shortLabel?: string;
  ref?: Ref<HTMLButtonElement>;
}

export const HeaderLanguageToggle = ({
  lang,
  shortLabel,
  className,
  children,
  ...props
}: HeaderLanguageToggleProps) => (
  <button
    type="button"
    {...props}
    lang={lang}
    className={cx(
      headerButtonVariants({ variant: 'outline' }),
      'pcgl-header-language-toggle pcgl:max-md:px-2.5',
      className,
    )}
  >
    {shortLabel ? (
      <>
        <span className="pcgl:max-md:sr-only">{children}</span>
        <span aria-hidden="true" className="pcgl:md:hidden">
          {shortLabel}
        </span>
      </>
    ) : (
      children
    )}
  </button>
);
