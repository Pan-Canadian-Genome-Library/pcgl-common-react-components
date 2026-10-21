import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { HeaderContainer, AuthenticationComponent, AccessibilityLinks } from '../header';

describe('HeaderContainer', () => {
  it('renders mandatory skip links (AccessibilityLinks) and header container', () => {
    render(<HeaderContainer />);

    const container = screen.getByTestId('pcgl-header-container');
    const header = screen.getByTestId('pcgl-header');
    expect(container).toBeInTheDocument();
    expect(header).toBeInTheDocument();

    const skipLinksList = document.querySelector('ul#wb-tphp');
    expect(skipLinksList).toBeInTheDocument();

    const mainContentLink = screen.getByRole('link', { name: 'Skip to main content' });
    expect(mainContentLink).toHaveAttribute('href', '#app-content');

    const aboutLink = screen.getByRole('link', { name: 'Skip to "About PCGL"' });
    expect(aboutLink).toHaveAttribute('href', '#app-info');
  });

  it('renders mandatory AuthenticationComponent in logged-out state by default', () => {
    render(<HeaderContainer />);

    const loginLink = screen.getByTestId('pcgl-login-link');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', 'https://cilogon.org/');
    expect(loginLink).toHaveTextContent('CILogon Service');

    const img = loginLink.querySelector('img');
    expect(img).toHaveAttribute('src', 'https://cilogon.org/images/cilogon-logo-32x32.png');
  });

  it('renders mandatory AuthenticationComponent with <details> and <summary> when user is logged in', () => {
    render(
      <HeaderContainer
        auth={{
          user: { name: 'Dr. Jane Smith' },
        }}
      />
    );

    const authDetails = screen.getByTestId('pcgl-auth-details');
    expect(authDetails).toBeInTheDocument();
    expect(authDetails.tagName.toLowerCase()).toBe('details');

    const summary = screen.getByTestId('pcgl-auth-summary');
    expect(summary).toBeInTheDocument();
    expect(summary).toHaveTextContent('Dr. Jane Smith');

    const mySettingsLink = screen.getByRole('menuitem', { name: 'My Settings' });
    expect(mySettingsLink).toBeInTheDocument();
    expect(mySettingsLink).toHaveAttribute('href', '#settings');

    const logOutLink = screen.getByRole('menuitem', { name: 'Log Out' });
    expect(logOutLink).toBeInTheDocument();
    expect(logOutLink).toHaveAttribute('href', '#logout');
  });

  it('handles custom onSettingsClick and onLogout callbacks', () => {
    const handleSettings = vi.fn((e: React.MouseEvent<HTMLElement>) => e.preventDefault());
    const handleLogout = vi.fn((e: React.MouseEvent<HTMLElement>) => e.preventDefault());

    render(
      <HeaderContainer
        auth={{
          user: { name: 'John Doe' },
          onSettingsClick: handleSettings,
          onLogout: handleLogout,
        }}
      />
    );

    const settingsLink = screen.getByRole('menuitem', { name: 'My Settings' });
    fireEvent.click(settingsLink);
    expect(handleSettings).toHaveBeenCalledTimes(1);

    const logoutLink = screen.getByRole('menuitem', { name: 'Log Out' });
    fireEvent.click(logoutLink);
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });

  it('renders optional slots (MenuOptions, ImageLogo, SearchBar) when passed as functions', () => {
    const renderMenu = vi.fn(() => <nav data-test-id="custom-menu">Menu Links</nav>);
    const renderLogo = vi.fn(() => <img alt="Test Logo" data-test-id="custom-logo" src="/test-logo.svg" />);
    const renderSearch = vi.fn(() => <input type="search" placeholder="Search..." data-test-id="custom-search" />);

    render(
      <HeaderContainer
        MenuOptions={renderMenu}
        ImageLogo={renderLogo}
        SearchBar={renderSearch}
      />
    );

    expect(renderMenu).toHaveBeenCalledTimes(1);
    expect(renderLogo).toHaveBeenCalledTimes(1);
    expect(renderSearch).toHaveBeenCalledTimes(1);

    expect(screen.getByTestId('custom-menu')).toBeInTheDocument();
    expect(screen.getByTestId('custom-logo')).toBeInTheDocument();
    expect(screen.getByTestId('custom-search')).toBeInTheDocument();
  });

  it('renders optional slots when passed as ReactNodes directly', () => {
    render(
      <HeaderContainer
        MenuOptions={<button data-test-id="menu-btn">Toggle</button>}
        ImageLogo={<span data-test-id="text-logo">PCGL Logo</span>}
        SearchBar={<form data-test-id="search-form"><input /></form>}
      />
    );

    expect(screen.getByTestId('menu-btn')).toBeInTheDocument();
    expect(screen.getByTestId('text-logo')).toBeInTheDocument();
    expect(screen.getByTestId('search-form')).toBeInTheDocument();
  });

  it('does not render optional slot containers if slots are omitted', () => {
    render(<HeaderContainer />);

    expect(document.querySelector('.pcgl-header-start')).not.toBeInTheDocument();
    expect(document.querySelector('.pcgl-header-center')).not.toBeInTheDocument();
  });

  it('supports custom skipLinks list', () => {
    const customLinks = [
      { href: '#custom-content', label: 'Skip to primary view' },
      { href: '#custom-footer', label: 'Skip to footer' },
    ];

    render(<HeaderContainer skipLinks={customLinks} />);

    expect(screen.getByRole('link', { name: 'Skip to primary view' })).toHaveAttribute('href', '#custom-content');
    expect(screen.getByRole('link', { name: 'Skip to footer' })).toHaveAttribute('href', '#custom-footer');
  });

  it('translates strings when translator is provided', () => {
    const mockTranslator = (key: string) => {
      const dict: Record<string, string> = {
        'header.skipLinks.mainContent': 'Passer au contenu principal',
        'header.skipLinks.about': 'Passer à "À propos"',
        'header.auth.login': 'Connexion CILogon',
        'header.auth.mySettings': 'Mes paramètres',
        'header.auth.logOut': 'Se déconnecter',
      };
      return dict[key] ?? key;
    };

    const { rerender } = render(<HeaderContainer translator={mockTranslator} />);

    expect(screen.getByRole('link', { name: 'Passer au contenu principal' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Passer à "À propos"' })).toBeInTheDocument();
    expect(screen.getByText('Connexion CILogon')).toBeInTheDocument();

    rerender(
      <HeaderContainer
        translator={mockTranslator}
        auth={{ user: { name: 'Jean Dupont' } }}
      />
    );

    expect(screen.getByRole('menuitem', { name: 'Mes paramètres' })).toBeInTheDocument();
    expect(screen.getByRole('menuitem', { name: 'Se déconnecter' })).toBeInTheDocument();
  });

  it('supports custom AuthenticationComponent slot override', () => {
    render(
      <HeaderContainer
        auth={{ user: { name: 'CustomUser' } }}
        AuthenticationComponent={(authProps) => (
          <div data-test-id="custom-auth-slot">Welcome, {authProps.user?.name}</div>
        )}
      />
    );

    expect(screen.getByTestId('custom-auth-slot')).toHaveTextContent('Welcome, CustomUser');
    expect(screen.queryByTestId('pcgl-auth-details')).not.toBeInTheDocument();
  });

  it('supports custom AccessibilityLinks slot override', () => {
    render(
      <HeaderContainer
        AccessibilityLinks={() => (
          <nav data-test-id="custom-accessibility-slot">Custom Skip Links</nav>
        )}
      />
    );

    expect(screen.getByTestId('custom-accessibility-slot')).toBeInTheDocument();
    expect(document.querySelector('#wb-tphp')).not.toBeInTheDocument();
  });

  it('forwards ref, custom brand, and DOM attributes', () => {
    const ref = createRef<HTMLDivElement>();
    render(
      <HeaderContainer
        ref={ref}
        brand="#FF5500"
        aria-label="Site Header"
      />
    );

    expect(ref.current).toBeInstanceOf(HTMLDivElement);
    expect(ref.current).toHaveAttribute('data-brand-color', '#FF5500');
    expect(ref.current?.style.getPropertyValue('--brand-color')).toBe('#FF5500');
    expect(ref.current).toHaveAttribute('aria-label', 'Site Header');
  });
});

describe('Standalone subcomponents', () => {
  it('AuthenticationComponent renders login link when user is null', () => {
    render(<AuthenticationComponent loginUrl="https://custom.login" loginText="Sign In Here" />);
    const link = screen.getByTestId('pcgl-login-link');
    expect(link).toHaveAttribute('href', 'https://custom.login');
    expect(link).toHaveTextContent('Sign In Here');
  });

  it('AccessibilityLinks renders list with provided links', () => {
    render(<AccessibilityLinks links={[{ href: '#test', label: 'Test Link' }]} />);
    expect(screen.getByRole('link', { name: 'Test Link' })).toHaveAttribute('href', '#test');
  });
});
