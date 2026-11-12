import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import {
  Header,
  HeaderButton,
  HeaderLanguageToggle,
  HeaderNavLink,
  HeaderUserMenu,
  HeaderUserMenuItem,
  type HeaderLinkComponentProps,
  type HeaderProps,
} from '..';

const messages: Record<string, string> = {
  'header.skipLinks.main': 'Skip to main content',
  'header.skipLinks.footer': 'Skip to footer',
  'header.home': 'PCGL Research Portal home',
  'header.nav': 'Main',
  'header.menu.open': 'Open menu',
  'header.menu.close': 'Close menu',
  'header.userMenu.label': 'Account menu',
};
const translator = (key: string) => messages[key] ?? key;

describe('@repo/ui/header', () => {
  const renderHeader = (props: Partial<HeaderProps> = {}) =>
    render(
      <Header
        logo={<img src="logo.svg" alt="" />}
        translator={translator}
        nav={
          <>
            <HeaderNavLink href="/policies" current>
              Policies & Guidelines
            </HeaderNavLink>
            <HeaderNavLink href="/help">Help Guides</HeaderNavLink>
          </>
        }
        language={
          <HeaderLanguageToggle lang="fr" shortLabel="FR">
            Français
          </HeaderLanguageToggle>
        }
        actions={<HeaderButton>Register</HeaderButton>}
        account={
          <HeaderButton variant="primary" href="/api/login">
            Login
          </HeaderButton>
        }
        {...props}
      />,
    );

  /** The panel duplicates nav and actions for mobile; desktop assertions use the bar only. */
  const bar = (container: HTMLElement) => container.querySelector<HTMLElement>('.pcgl-header-bar')!;
  const panel = (container: HTMLElement) =>
    container.querySelector<HTMLElement>('.pcgl-header-panel')!;

  describe('Header', () => {
    it('has no axe violations when logged out and logged in', async () => {
      const { container, unmount } = renderHeader();
      expect(await axe(container)).toHaveNoViolations();
      unmount();

      const loggedIn = renderHeader({
        actions: <HeaderNavLink href="/dashboard">My Applications</HeaderNavLink>,
        account: (
          <HeaderUserMenu name="Jane Long Name" email="j.longname@oicr.on.ca">
            <HeaderUserMenuItem>Logout</HeaderUserMenuItem>
          </HeaderUserMenu>
        ),
      });
      expect(await axe(loggedIn.container)).toHaveNoViolations();
    });

    it('renders the slots with stable hook classes and merges className', () => {
      const { container } = renderHeader({ className: 'daco-header' });
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('pcgl-header', 'daco-header');
      expect(within(bar(container)).getByRole('navigation', { name: 'Main' })).toHaveClass(
        'pcgl-header-nav',
      );
      expect(container.querySelector('.pcgl-header-language')).toBeInTheDocument();
      expect(container.querySelector('.pcgl-header-actions')).toBeInTheDocument();
      expect(container.querySelector('.pcgl-header-account')).toBeInTheDocument();
    });

    it('wraps the logo in a home link named by the translator', () => {
      renderHeader({ logoHref: '/home' });
      expect(screen.getByRole('link', { name: 'PCGL Research Portal home' })).toHaveAttribute(
        'href',
        '/home',
      );
    });

    it('shows the divider only when language sits next to actions or account', () => {
      const { container, unmount } = renderHeader();
      expect(container.querySelector('.pcgl-header-divider')).toBeInTheDocument();
      unmount();

      const withoutLanguage = renderHeader({ language: undefined });
      expect(withoutLanguage.container.querySelector('.pcgl-header-divider')).toBeNull();
      withoutLanguage.unmount();

      const languageOnly = renderHeader({ actions: undefined, account: undefined });
      expect(languageOnly.container.querySelector('.pcgl-header-divider')).toBeNull();
    });

    it('applies the brand shortcut as a CSS variable', () => {
      renderHeader({ brand: '#054a74' });
      expect(screen.getByRole('banner').style.getPropertyValue('--pcgl-header-brand')).toBe(
        '#054a74',
      );
    });

    it('places the banner slot after the skip links and before the logo in tab order', () => {
      renderHeader({ banner: <button type="button">Close announcement</button> });

      const skipLink = screen.getByRole('link', { name: 'Skip to main content' });
      const bannerButton = screen.getByRole('button', { name: 'Close announcement' });
      const logo = screen.getByRole('link', { name: 'PCGL Research Portal home' });

      expect(skipLink.compareDocumentPosition(bannerButton)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
      expect(bannerButton.compareDocumentPosition(logo)).toBe(Node.DOCUMENT_POSITION_FOLLOWING);
    });

    describe('skip links', () => {
      it('renders #main and #footer first by default', () => {
        const { container } = renderHeader();
        const links = container.querySelectorAll<HTMLAnchorElement>('.pcgl-skip-link');
        expect([...links].map((link) => [link.getAttribute('href'), link.textContent])).toEqual([
          ['#main-content', 'Skip to main content'],
          ['#about-us-footer', 'Skip to footer'],
        ]);
        expect(container.querySelector('a')).toBe(links[0]);
      });

      it('accepts custom links and renders none for []', () => {
        const { container, unmount } = renderHeader({
          skipLinks: [{ href: '#content', label: 'Skip to content' }],
        });
        expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute(
          'href',
          '#content',
        );
        unmount();
        const none = renderHeader({ skipLinks: [] });
        expect(none.container.querySelector('.pcgl-skip-links')).toBeNull();
        expect(container.querySelector('.pcgl-skip-links')).toBeNull();
      });

      it('moves focus to the target, making it focusable when needed', () => {
        renderHeader({ skipLinks: [{ href: '#main', label: 'Skip to main content' }] });
        const main = document.createElement('main');
        main.id = 'main';
        document.body.append(main);

        fireEvent.click(screen.getByRole('link', { name: 'Skip to main content' }));
        expect(main).toHaveAttribute('tabindex', '-1');
        expect(main).toHaveFocus();
        main.remove();
      });
    });

    describe('mobile menu', () => {
      it('toggles the panel with aria-expanded and a translated label', () => {
        const { container } = renderHeader();
        const toggle = screen.getByRole('button', { name: 'Open menu' });
        expect(toggle).toHaveAttribute('aria-expanded', 'false');
        expect(panel(container)).not.toBeVisible();
        expect(toggle).toHaveAttribute('aria-controls', panel(container).id);

        fireEvent.click(toggle);
        expect(toggle).toHaveAttribute('aria-expanded', 'true');
        expect(toggle).toHaveAccessibleName('Close menu');
        expect(panel(container)).toBeVisible();
        expect(within(panel(container)).getByRole('link', { name: 'Help Guides' })).toBeVisible();
        expect(within(panel(container)).getByRole('button', { name: 'Register' })).toBeVisible();
      });

      it('closes on Escape and returns focus to the toggle', () => {
        const { container } = renderHeader();
        const toggle = screen.getByRole('button', { name: 'Open menu' });
        fireEvent.click(toggle);
        fireEvent.keyDown(document, { key: 'Escape' });
        expect(panel(container)).not.toBeVisible();
        expect(toggle).toHaveFocus();
      });

      it('closes on a pointer down outside, but not inside the panel', () => {
        const { container } = renderHeader();
        const toggle = screen.getByRole('button', { name: 'Open menu' });
        fireEvent.click(toggle);

        fireEvent.pointerDown(panel(container));
        expect(panel(container)).toBeVisible();

        fireEvent.pointerDown(document.body);
        expect(panel(container)).not.toBeVisible();
        expect(toggle).toHaveAttribute('aria-expanded', 'false');
      });

      it('closes when a link or button inside it is used', () => {
        const onRegister = vi.fn();
        const { container } = renderHeader({
          actions: <HeaderButton onClick={onRegister}>Register</HeaderButton>,
        });
        const toggle = screen.getByRole('button', { name: 'Open menu' });

        fireEvent.click(toggle);
        fireEvent.click(within(panel(container)).getByRole('button', { name: 'Register' }));
        expect(onRegister).toHaveBeenCalledOnce();
        expect(panel(container)).not.toBeVisible();

        fireEvent.click(toggle);
        fireEvent.click(within(panel(container)).getByRole('link', { name: 'Help Guides' }));
        expect(panel(container)).not.toBeVisible();
      });

      it('is not rendered when there is nothing to collapse', () => {
        renderHeader({ nav: undefined, actions: undefined });
        expect(screen.queryByRole('button', { name: 'Open menu' })).toBeNull();
      });
    });

    it('renders internal links through linkComponent, but not external links or HeaderButton', () => {
      const RouterLink = ({ href, children, ...props }: HeaderLinkComponentProps) => (
        <a data-router="true" href={href} {...props}>
          {children}
        </a>
      );
      const { container } = renderHeader({
        linkComponent: RouterLink,
        nav: (
          <>
            <HeaderNavLink href="/help">Help Guides</HeaderNavLink>
            <HeaderNavLink href="https://genomelibrary.ca">PCGL Website</HeaderNavLink>
          </>
        ),
      });
      const navBar = within(bar(container));
      expect(screen.getByRole('link', { name: 'PCGL Research Portal home' })).toHaveAttribute(
        'data-router',
      );
      expect(navBar.getByRole('link', { name: 'Help Guides' })).toHaveAttribute('data-router');
      expect(navBar.getByRole('link', { name: 'PCGL Website' })).not.toHaveAttribute('data-router');
      expect(navBar.getByRole('link', { name: 'Login' })).not.toHaveAttribute('data-router');
    });
  });

  describe('HeaderNavLink', () => {
    it('marks the current page', () => {
      const { container } = renderHeader();
      const nav = within(bar(container));
      expect(nav.getByRole('link', { name: 'Policies & Guidelines' })).toHaveAttribute(
        'aria-current',
        'page',
      );
      expect(nav.getByRole('link', { name: 'Help Guides' })).not.toHaveAttribute('aria-current');
    });

    it('opens external links in a new tab', () => {
      render(<HeaderNavLink href="https://genomelibrary.ca">PCGL</HeaderNavLink>);
      const link = screen.getByRole('link', { name: 'PCGL' });
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noreferrer');
    });

    it('lists nav items one per list item, flattening fragments', () => {
      const { container } = renderHeader();
      expect(within(bar(container)).getAllByRole('listitem')).toHaveLength(2);
    });
  });

  describe('HeaderButton', () => {
    it('renders a button by default and an <a> with href', () => {
      render(
        <>
          <HeaderButton>Register</HeaderButton>
          <HeaderButton href="/api/login" variant="primary" className="custom">
            Login
          </HeaderButton>
        </>,
      );
      expect(screen.getByRole('button', { name: 'Register' })).toHaveAttribute('type', 'button');
      const login = screen.getByRole('link', { name: 'Login' });
      expect(login).toHaveAttribute('href', '/api/login');
      expect(login).toHaveClass('pcgl-header-button', 'custom');
    });

    it('disables and marks busy while loading', () => {
      const onClick = vi.fn();
      render(
        <>
          <HeaderButton loading onClick={onClick}>
            Sign out
          </HeaderButton>
          <HeaderButton loading href="/api/login">
            Login
          </HeaderButton>
        </>,
      );
      const button = screen.getByRole('button', { name: 'Sign out' });
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute('aria-busy', 'true');

      const link = screen.getByRole('link', { name: 'Login' });
      expect(link).toHaveAttribute('aria-disabled', 'true');
      expect(fireEvent.click(link)).toBe(false); // default navigation prevented
    });
  });

  describe('HeaderLanguageToggle', () => {
    it('sets lang and keeps the full label as the accessible name', () => {
      const onClick = vi.fn();
      render(
        <HeaderLanguageToggle lang="fr" shortLabel="FR" onClick={onClick}>
          Français
        </HeaderLanguageToggle>,
      );
      const toggle = screen.getByRole('button', { name: 'Français' });
      expect(toggle).toHaveAttribute('lang', 'fr');
      fireEvent.click(toggle);
      expect(onClick).toHaveBeenCalledOnce();
    });
  });

  describe('HeaderUserMenu', () => {
    const renderMenu = (onLogout = vi.fn()) => {
      render(
        <Header
          logo="PCGL"
          translator={translator}
          account={
            <HeaderUserMenu name="Jane Long Name" email="j.longname@oicr.on.ca">
              <HeaderUserMenuItem onClick={onLogout}>Logout</HeaderUserMenuItem>
            </HeaderUserMenu>
          }
        />,
      );
      return screen.getByRole('button', { name: /Account menu/ });
    };

    it('names the toggle with the label, name and email', () => {
      expect(renderMenu()).toHaveAccessibleName(
        'Account menu, Jane Long Name, j.longname@oicr.on.ca',
      );
    });

    it('opens on click and closes on Escape, returning focus', () => {
      const toggle = renderMenu();
      expect(screen.queryByRole('button', { name: 'Logout' })).toBeNull();

      fireEvent.click(toggle);
      expect(toggle).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('button', { name: 'Logout' })).toBeVisible();

      fireEvent.keyDown(document, { key: 'Escape' });
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
      expect(toggle).toHaveFocus();
    });

    it('closes on a click outside', () => {
      const toggle = renderMenu();
      fireEvent.click(toggle);
      fireEvent.pointerDown(document.body);
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });

    it('runs the item action and closes', () => {
      const onLogout = vi.fn();
      const toggle = renderMenu(onLogout);
      fireEvent.click(toggle);
      fireEvent.click(screen.getByRole('button', { name: 'Logout' }));
      expect(onLogout).toHaveBeenCalledOnce();
      expect(toggle).toHaveAttribute('aria-expanded', 'false');
    });

    it('renders an <a> item with href', () => {
      const toggle = renderMenu();
      fireEvent.click(toggle);
      render(<HeaderUserMenuItem href="/api/logout">Logout link</HeaderUserMenuItem>);
      expect(screen.getByRole('link', { name: 'Logout link' })).toHaveAttribute(
        'href',
        '/api/logout',
      );
    });
  });
});
