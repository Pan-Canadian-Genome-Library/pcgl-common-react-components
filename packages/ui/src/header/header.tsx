import { type ComponentPropsWithRef, type CSSProperties, type ReactNode } from 'react';
import './header.css';

export interface SkipLinkItem {
  href: string;
  label: string;
}

export interface HeaderUser {
  name: string;
  email?: string;
  [key: string]: unknown;
}

export type SlotProp<T = void> = ReactNode | ((props: T) => ReactNode);

export interface HeaderAuthProps {
  user?: HeaderUser | null;
  loginUrl?: string;
  loginText?: string;
  loginLogoUrl?: string;
  settingsUrl?: string;
  settingsLabel?: string;
  onSettingsClick?: (event: React.MouseEvent<HTMLElement>) => void;
  SettingsSlot?: SlotProp;
  logoutUrl?: string;
  logoutLabel?: string;
  onLogout?: (event: React.MouseEvent<HTMLElement>) => void;
  LogoutSlot?: SlotProp;
  translator?: (key: string) => string;
}

export interface AccessibilityLinksProps {
  links?: SkipLinkItem[];
  translator?: (key: string) => string;
}

export interface HeaderProps extends ComponentPropsWithRef<'div'> {
  brand?: string;
  skipLinks?: SkipLinkItem[];
  AccessibilityLinks?: SlotProp<AccessibilityLinksProps>;
  MenuOptions?: SlotProp;
  ImageLogo?: SlotProp;
  SearchBar?: SlotProp;
  auth?: HeaderAuthProps;
  AuthenticationComponent?: SlotProp<HeaderAuthProps>;
  translator?: (key: string) => string;
}

interface CustomStyles extends CSSProperties {
  '--brand-color'?: string;
}

const renderSlot = <T,>(slot?: SlotProp<T>, slotProps?: T): ReactNode => {
  if (typeof slot === 'function') {
    return (slot as (props?: T) => ReactNode)(slotProps);
  }
  return slot ?? null;
};

/**
 * Accessibility skip links component (WET-BOEW compliant)
 */
export const AccessibilityLinks = ({ links, translator }: AccessibilityLinksProps) => {
  const defaultLinks: SkipLinkItem[] = [
    {
      href: '#wb-cont',
      label: translator ? translator('header.skipLinks.mainContent') : 'Skip to main content',
    },
    {
      href: '#wb-info',
      label: translator ? translator('header.skipLinks.about') : 'Skip to "About PCGL"',
    },
  ];

  const items = links ?? defaultLinks;

  return (
    <ul id="wb-tphp" className="wb-init wb-disable-inited">
      {items.map((link) => (
        <li key={link.href} className="wb-slc">
          <a className="wb-sl" href={link.href}>
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
};

/**
 * Authentication component
 * If user is authenticated: renders <details> hamburger menu with user name, My Settings and Log Out.
 * If user is not authenticated: renders CILogon login link.
 */
export const AuthenticationComponent = ({
  user,
  loginUrl = 'https://cilogon.org/',
  loginText,
  loginLogoUrl = 'https://cilogon.org/images/cilogon-logo-32x32.png',
  settingsUrl = '#settings',
  settingsLabel,
  onSettingsClick,
  SettingsSlot,
  logoutUrl = '#logout',
  logoutLabel,
  onLogout,
  LogoutSlot,
  translator,
}: HeaderAuthProps) => {
  const resolvedLoginText = loginText ?? (translator ? translator('header.auth.login') : 'CILogon Service');
  const resolvedSettingsLabel = settingsLabel ?? (translator ? translator('header.auth.mySettings') : 'My Settings');
  const resolvedLogoutLabel = logoutLabel ?? (translator ? translator('header.auth.logOut') : 'Log Out');

  if (user?.name) {
    return (
      <div className="pcgl-auth" data-test-id="pcgl-auth">
        <details className="pcgl-auth-details" data-test-id="pcgl-auth-details">
          <summary className="pcgl-auth-summary" data-test-id="pcgl-auth-summary" aria-label={`User menu for ${user.name}`}>
            <span className="pcgl-auth-hamburger" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </span>
            <span className="pcgl-auth-username">{user.name}</span>
            <span className="pcgl-auth-chevron" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </summary>
          <div className="pcgl-auth-dropdown" role="menu">
            {SettingsSlot ? (
              renderSlot(SettingsSlot)
            ) : (
              <a
                href={settingsUrl}
                onClick={onSettingsClick}
                className="pcgl-auth-dropdown-item focus-ring"
                role="menuitem"
              >
                {resolvedSettingsLabel}
              </a>
            )}
            <div className="pcgl-auth-dropdown-divider" role="separator" />
            {LogoutSlot ? (
              renderSlot(LogoutSlot)
            ) : (
              <a
                href={logoutUrl}
                onClick={onLogout}
                className="pcgl-auth-dropdown-item focus-ring"
                role="menuitem"
              >
                {resolvedLogoutLabel}
              </a>
            )}
          </div>
        </details>
      </div>
    );
  }

  return (
    <div className="pcgl-auth" data-test-id="pcgl-auth">
      <a
        href={loginUrl}
        className="pcgl-auth-login-link focus-ring"
        data-test-id="pcgl-login-link"
      >
        <img
          alt=""
          src={loginLogoUrl}
          className="pcgl-auth-login-icon"
          style={{ verticalAlign: 'middle' }}
        />
        &nbsp;{resolvedLoginText}
      </a>
    </div>
  );
};

/**
 * HeaderContainer
 * Structure:
 * <div>
 *   {{ AccessibilityLinks }}
 *   <header>
 *     {{ MenuOptions }}
 *     {{ ImageLogo }}
 *     {{ SearchBar }}
 *     {{ AuthenticationComponent }}
 *   </header>
 * </div>
 */
export const HeaderContainer = ({
  brand = '#054A74',
  skipLinks,
  AccessibilityLinks: AccessibilityLinksProp,
  MenuOptions,
  ImageLogo,
  SearchBar,
  auth = {},
  AuthenticationComponent: AuthenticationComponentProp,
  translator,
  style,
  ref,
  ...props
}: HeaderProps) => {
  const headerStyle: CustomStyles = {
    '--brand-color': brand,
  };

  const renderedAccessibilityLinks = AccessibilityLinksProp !== undefined
    ? renderSlot(AccessibilityLinksProp, { links: skipLinks, translator })
    : <AccessibilityLinks links={skipLinks} translator={translator} />;

  const authProps: HeaderAuthProps = {
    ...auth,
    translator: auth.translator ?? translator,
  };

  const renderedAuthComponent = AuthenticationComponentProp !== undefined
    ? renderSlot(AuthenticationComponentProp, authProps)
    : <AuthenticationComponent {...authProps} />;

  return (
    <div
      data-test-id="pcgl-header-container"
      className="pcgl-header-container"
      data-brand-color={brand}
      style={{ ...headerStyle, ...style }}
      ref={ref}
      {...props}
    >
      {renderedAccessibilityLinks}
      <header data-test-id="pcgl-header" className="pcgl-header">
        {(MenuOptions || ImageLogo) && (
          <div className="pcgl-header-start">
            {renderSlot(MenuOptions)}
            {renderSlot(ImageLogo)}
          </div>
        )}
        {SearchBar && (
          <div className="pcgl-header-center">
            {renderSlot(SearchBar)}
          </div>
        )}
        <div className="pcgl-header-end">
          {renderedAuthComponent}
        </div>
      </header>
    </div>
  );
};

export const Header = HeaderContainer;
export default HeaderContainer;
