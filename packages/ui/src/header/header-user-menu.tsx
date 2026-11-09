import {
  Children,
  useEffect,
  useId,
  useRef,
  useState,
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ComponentPropsWithRef,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react';
import { cx } from 'class-variance-authority';
import { buttonReset, focusRing, listReset } from '../lib/reset';
import { useHeaderContext } from './header-context';
import { ChevronDownIcon, UserIcon } from './icons';

export interface HeaderUserMenuProps extends Omit<ComponentPropsWithRef<'div'>, 'children'> {
  name: string;
  email?: string;
  children: ReactNode;
}

export const HeaderUserMenu = ({
  name,
  email,
  children,
  className,
  ...props
}: HeaderUserMenuProps) => {
  const { translator } = useHeaderContext();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const listId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const onItemClick = (event: MouseEvent<HTMLElement>) => {
    if ((event.target as Element).closest('a, button')) setOpen(false);
  };

  return (
    <div
      {...props}
      ref={rootRef}
      className={cx('pcgl-header-user-menu', 'pcgl:relative', className)}
    >
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={[translator('header.userMenu.label'), name, email].filter(Boolean).join(', ')}
        onClick={() => setOpen((value) => !value)}
        title={name}
        className={cx(
          'pcgl-header-user-menu-toggle',
          buttonReset,
          focusRing,
          'pcgl:flex pcgl:items-center pcgl:gap-3 pcgl:rounded-md pcgl:border-0 pcgl:bg-transparent pcgl:p-2 pcgl:text-left',
          'pcgl:text-[color:var(--pcgl-header-text,#000)] pcgl:focus-visible:outline-[color:var(--pcgl-header-brand,#761248)]',
        )}
      >
        <UserIcon className="pcgl:size-6 pcgl:md:hidden" />
        <span className="pcgl:flex pcgl:max-w-40 pcgl:flex-col pcgl:text-xs pcgl:leading-tight pcgl:max-md:hidden">
          <span className="pcgl:truncate">{name}</span>
          {email ? (
            <span className="pcgl:truncate pcgl:text-[color:var(--pcgl-header-brand,#761248)]">
              {email}
            </span>
          ) : null}
        </span>
        <ChevronDownIcon
          className={cx(
            'pcgl:max-md:hidden pcgl:text-[color:var(--pcgl-header-brand,#761248)] pcgl:transition-transform',
            open && 'pcgl:rotate-180',
          )}
        />
      </button>
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions */}
      <ul
        id={listId}
        hidden={!open}
        onClick={onItemClick}
        className={cx(
          'pcgl-header-user-menu-list',
          listReset,
          'pcgl:absolute pcgl:top-full pcgl:right-0 pcgl:z-[1001] pcgl:mt-1 pcgl:min-w-40 pcgl:rounded-md pcgl:py-1 pcgl:shadow-lg',
          'pcgl:border pcgl:border-[color:var(--pcgl-header-border,#929497)] pcgl:bg-[color:var(--pcgl-header-bg,#fff)]',
        )}
      >
        {Children.toArray(children).map((child, index) => (
          <li key={index}>{child}</li>
        ))}
      </ul>
    </div>
  );
};

const itemClasses = cx(
  'pcgl-header-user-menu-item',
  focusRing,
  'pcgl:block pcgl:w-full pcgl:px-4 pcgl:py-2 pcgl:text-left pcgl:text-sm pcgl:no-underline',
  'pcgl:text-[color:var(--pcgl-header-text,#000)] pcgl:hover:bg-neutral-100',
);

export type HeaderUserMenuItemProps =
  | (AnchorHTMLAttributes<HTMLAnchorElement> & { href: string; ref?: Ref<HTMLAnchorElement> })
  | (ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined; ref?: Ref<HTMLButtonElement> });

/** An entry in HeaderUserMenu: a plain `<a>` with `href` (e.g. a logout route), otherwise a button. */
export const HeaderUserMenuItem = ({ className, children, ...props }: HeaderUserMenuItemProps) => {
  if (props.href !== undefined) {
    const { href, ...anchor } = props as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a {...anchor} href={href} className={cx(itemClasses, className)}>
        {children}
      </a>
    );
  }
  const { type = 'button', ...button } = props as ButtonHTMLAttributes<HTMLButtonElement>;
  return (
    <button
      {...button}
      type={type}
      className={cx(itemClasses, buttonReset, 'pcgl:border-0 pcgl:bg-transparent', className)}
    >
      {children}
    </button>
  );
};
