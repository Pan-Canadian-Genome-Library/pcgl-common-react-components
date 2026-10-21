import { type ComponentPropsWithRef, type CSSProperties, type ReactNode } from 'react';

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

// Note: ensure the client has #app-content and #app-info ids 
export const AccessibilityLinks = ({ links, translator }: AccessibilityLinksProps) => {
  const defaultLinks: SkipLinkItem[] = [
    {
      href: '#app-content',
      label: translator ? translator('header.skipLinks.mainContent') : 'Skip to main content',
    },
    {
      href: '#app-info',
      label: translator ? translator('header.skipLinks.about') : 'Skip to "About PCGL"',
    },
  ];

  const items = links ?? defaultLinks;

  return (
    <ul
      id="wb-tphp"
      data-test-id="skip-links"
      className="ui:absolute ui:text-xl ui:left-1/2"
    >
      {items.map((link) => (
        <li key={link.href} className="ui:list-none">
          <a
            className="ui:bg-black ui:text-white ui:underline ui:sr-only ui:focus:not-sr-only"
            href={link.href}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  );
};

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
      <div className="pcgl-auth ui:inline-flex ui:items-center ui:relative" data-test-id="pcgl-auth">
        <details className="pcgl-auth-details ui:relative ui:inline-block ui:group" data-test-id="pcgl-auth-details">
          <summary
            className="pcgl-auth-summary ui:inline-flex ui:items-center ui:gap-2.5 ui:px-3 ui:py-1.5 ui:border ui:border-pcgl-border ui:rounded-md ui:bg-white ui:text-[#24292f] ui:text-sm ui:font-medium hover:ui:bg-pcgl-bg-hover hover:ui:border-pcgl-border-hover focus-visible:ui:outline-2 focus-visible:ui:outline-pcgl-brand focus-visible:ui:outline-offset-2 ui:cursor-pointer ui:select-none ui:list-none [&::-webkit-details-marker]:ui:hidden"
            data-test-id="pcgl-auth-summary"
            aria-label={`User menu for ${user.name}`}
          >
            <span className="pcgl-auth-hamburger ui:inline-flex ui:items-center ui:justify-center ui:text-pcgl-text-muted" aria-hidden="true">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </span>
            <span className="pcgl-auth-username ui:font-semibold ui:text-pcgl-text-dark">{user.name}</span>
            <span className="pcgl-auth-chevron ui:inline-flex ui:items-center ui:transition-transform ui:duration-200 group-open:ui:rotate-180" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </summary>
          <div
            className="pcgl-auth-dropdown ui:absolute ui:top-[calc(100%+6px)] ui:right-0 ui:min-w-[180px] ui:bg-white ui:border ui:border-pcgl-border ui:rounded-lg ui:shadow-xl ui:py-1.5 ui:z-[1000] ui:flex ui:flex-col"
            role="menu"
          >
            {SettingsSlot ? (
              renderSlot(SettingsSlot)
            ) : (
              <a
                href={settingsUrl}
                onClick={onSettingsClick}
                className="pcgl-auth-dropdown-item ui:block ui:w-full ui:px-4 ui:py-2 ui:text-sm ui:text-[#24292f] ui:text-left ui:bg-transparent ui:border-none hover:ui:bg-neutral-100 hover:ui:text-pcgl-brand ui:transition-colors focus:ui:outline-2 focus:ui:outline-pcgl-brand focus:ui:outline-offset-2 focus-visible:ui:outline-2 focus-visible:ui:outline-pcgl-brand focus-visible:ui:outline-offset-2 ui:cursor-pointer ui:box-border"
                role="menuitem"
              >
                {resolvedSettingsLabel}
              </a>
            )}
            <div className="pcgl-auth-dropdown-divider ui:h-px ui:bg-pcgl-border ui:my-1" role="separator" />
            {LogoutSlot ? (
              renderSlot(LogoutSlot)
            ) : (
              <a
                href={logoutUrl}
                onClick={onLogout}
                className="pcgl-auth-dropdown-item ui:block ui:w-full ui:px-4 ui:py-2 ui:text-sm ui:text-[#24292f] ui:text-left ui:bg-transparent ui:border-none hover:ui:bg-neutral-100 hover:ui:text-pcgl-brand ui:transition-colors focus:ui:outline-2 focus:ui:outline-pcgl-brand focus:ui:outline-offset-2 focus-visible:ui:outline-2 focus-visible:ui:outline-pcgl-brand focus-visible:ui:outline-offset-2 ui:cursor-pointer ui:box-border"
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
    <div className="pcgl-auth ui:inline-flex ui:items-center ui:relative" data-test-id="pcgl-auth">
      <a
        href={loginUrl}
        className="pcgl-auth-login-link ui:inline-flex ui:items-center ui:gap-2 ui:px-3.5 ui:py-2 ui:text-sm ui:font-medium ui:text-pcgl-brand ui:bg-pcgl-brand-light ui:border ui:border-pcgl-brand-border ui:rounded-md ui:no-underline hover:ui:bg-pcgl-brand-light-hover hover:ui:border-pcgl-brand hover:ui:text-pcgl-brand-dark ui:transition-colors focus:ui:outline-2 focus:ui:outline-pcgl-brand focus:ui:outline-offset-2 focus-visible:ui:outline-2 focus-visible:ui:outline-pcgl-brand focus-visible:ui:outline-offset-2"
        data-test-id="pcgl-login-link"
      >
        <img
          alt=""
          src={loginLogoUrl}
          className="pcgl-auth-login-icon ui:w-6 ui:h-6 ui:align-middle"
        />
        <span>&nbsp;{resolvedLoginText}</span>
      </a>
    </div>
  );
};

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
      className="pcgl-header-container ui:w-full"
      data-brand-color={brand}
      style={{ ...headerStyle, ...style }}
      ref={ref}
      {...props}
    >
      {renderedAccessibilityLinks}
      <header
        data-test-id="pcgl-header"
        className="pcgl-header ui:flex ui:items-center ui:justify-between ui:gap-5 ui:px-6 ui:py-3 ui:max-w-[1440px] ui:mx-auto ui:box-border max-md:ui:flex-wrap max-md:ui:px-4 max-md:ui:py-2.5"
      >
        {(MenuOptions || ImageLogo) && (
          <div className="pcgl-header-start ui:flex ui:items-center ui:gap-4 ui:shrink-0">
            {renderSlot(MenuOptions)}
            {renderSlot(ImageLogo)}
          </div>
        )}
        {SearchBar && (
          <div className="pcgl-header-center ui:flex-1 ui:max-w-[600px] ui:flex ui:items-center max-md:ui:order-3 max-md:ui:basis-full max-md:ui:max-w-full max-md:ui:mt-2">
            {renderSlot(SearchBar)}
          </div>
        )}
        <div className="pcgl-header-end ui:flex ui:items-center ui:gap-4 ui:ml-auto ui:shrink-0">
          {renderedAuthComponent}
        </div>
      </header>
    </div>
  );
};

export const Header = HeaderContainer;
export default HeaderContainer;
