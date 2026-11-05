import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode, Ref } from 'react';
import { cva, cx, type VariantProps } from 'class-variance-authority';
import { buttonReset, focusRing } from '../lib/reset';
import { useHeaderContext } from './header-context';
import { SpinnerIcon } from './icons';

export const headerButtonVariants = cva(
  [
    'pcgl-header-button',
    buttonReset,
    focusRing,
    'pcgl:inline-flex pcgl:items-center pcgl:justify-center pcgl:gap-2 pcgl:whitespace-nowrap',
    'pcgl:rounded-md pcgl:px-4 pcgl:py-1.5 pcgl:text-sm pcgl:no-underline',
    'pcgl:disabled:opacity-60 pcgl:aria-disabled:opacity-60',
  ],
  {
    variants: {
      variant: {
        text: 'pcgl:border pcgl:border-transparent pcgl:bg-transparent pcgl:text-[color:var(--pcgl-header-text,#000)] pcgl:hover:text-[color:var(--pcgl-header-brand,#761248)]',
        outline:
          'pcgl:border pcgl:border-neutral-300 pcgl:bg-transparent pcgl:font-semibold pcgl:text-[color:var(--pcgl-header-text,#000)] pcgl:hover:text-[color:var(--pcgl-header-brand,#000)] pcgl:hover:border-[color:var(--pcgl-header-brand,#761248)]',
        primary:
          'pcgl:border pcgl:border-[color:var(--pcgl-header-brand,#761248)] pcgl:bg-[color:var(--pcgl-header-brand,#761248)] pcgl:font-semibold pcgl:text-white pcgl:hover:brightness-110',
      },
    },
    defaultVariants: { variant: 'text' },
  },
);

type HeaderButtonOwnProps = VariantProps<typeof headerButtonVariants> & {
  loading?: boolean;
  icon?: ReactNode;
};

export type HeaderButtonAsButtonProps = HeaderButtonOwnProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; ref?: Ref<HTMLButtonElement> };

export type HeaderButtonAsLinkProps = HeaderButtonOwnProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; ref?: Ref<HTMLAnchorElement> };

export type HeaderButtonProps = HeaderButtonAsButtonProps | HeaderButtonAsLinkProps;

type ElementProps<T> = Omit<T, keyof HeaderButtonOwnProps | 'className' | 'children'>;

const isLinkProps = (
  props: ElementProps<HeaderButtonProps>,
): props is ElementProps<HeaderButtonAsLinkProps> => props.href !== undefined;

export const HeaderButton = ({
  variant,
  loading = false,
  icon,
  className,
  children,
  ...props
}: HeaderButtonProps) => {
  const { closePanel } = useHeaderContext();
  const classes = cx(headerButtonVariants({ variant }), className);
  const content = (
    <>
      {loading ? (
        <SpinnerIcon className="pcgl:animate-spin" />
      ) : icon ? (
        <span aria-hidden="true" className="pcgl:inline-flex">
          {icon}
        </span>
      ) : null}
      {children}
    </>
  );

  if (isLinkProps(props)) {
    const { onClick, href, ...anchor } = props;
    return (
      <a
        {...anchor}
        href={href}
        className={classes}
        aria-busy={loading || undefined}
        aria-disabled={loading || anchor['aria-disabled']}
        onClick={(event: MouseEvent<HTMLAnchorElement>) => {
          if (loading) {
            event.preventDefault();
            return;
          }
          onClick?.(event);
          closePanel();
        }}
      >
        {content}
      </a>
    );
  }

  const { onClick, type = 'button', disabled, ...button } = props;
  return (
    <button
      {...button}
      type={type}
      className={classes}
      disabled={loading || disabled}
      aria-busy={loading || undefined}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        closePanel();
      }}
    >
      {content}
    </button>
  );
};
