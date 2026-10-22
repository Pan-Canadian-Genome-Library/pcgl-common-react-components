import {
  Children,
  type ComponentPropsWithRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import { cva, type VariantProps } from "class-variance-authority";

export const headerLinkVariants = cva(
  "ui:transition-colors focus:ui:outline-2 focus:ui:outline-offset-2 focus-visible:ui:outline-2 focus-visible:ui:outline-offset-2 ",
  {
    variants: {
      variant: {
        skipLink:
          "ui:bg-black ui:text-white ui:underline ui:sr-only ui:focus:not-sr-only",
        outlined:
          "ui:inline-flex ui:items-center ui:gap-2 ui:px-3.5 ui:py-2 ui:text-sm ui:font-medium ui:rounded-md ui:no-underline ui:border ui:border-[var(--brand-color,#054a74)] ui:text-[var(--brand-color,#054a74)] hover:ui:bg-neutral-100",
        dropdownItem:
          "ui:block ui:w-full ui:px-4 ui:py-2 ui:text-sm ui:text-black ui:text-left ui:bg-transparent ui:border-none ui:hover:border-black/10 ui:hover:bg-gray-100 ui:cursor-pointer ui:box-border",
      },
    },
    defaultVariants: {
      variant: "outlined",
    },
  }
);

export type HeaderLinkVariants = VariantProps<typeof headerLinkVariants>;

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

export interface HeaderProps extends ComponentPropsWithRef<"div"> {
  brandColor?: string;
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
  "--brand-color"?: string;
}

export const HeaderContainer = ({
  brandColor="#054A74",
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
    "--brand-color": brandColor,
  };

  const renderedAccessibilityLinks =
    AccessibilityLinksProp !== undefined ? (
      renderSlot(AccessibilityLinksProp, { links: skipLinks, translator })
    ) : (
      <AccessibilityLinks links={skipLinks} translator={translator} />
    );

  const authProps: HeaderAuthProps = {
    ...auth,
    translator: auth.translator ?? translator,
  };

  const renderedAuthComponent =
    AuthenticationComponentProp !== undefined ? (
      renderSlot(AuthenticationComponentProp, authProps)
    ) : (
      <AuthenticationComponent {...authProps} />
    );

  return (
    <div
      data-test-id="pcgl-header-container"
      className="pcgl-header-container ui:w-full ui:@container/header"
      data-brand-color={brandColor}
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
            {renderSlot(ImageLogo)}
            {renderSlot(MenuOptions)}
          </div>
        )}
        {SearchBar && (
          <div className="pcgl-header-center ui:flex-1 ui:max-w-[600px] ui:flex ui:items-center max-md:ui:order-3 max-md:ui:basis-full max-md:ui:max-w-full max-md:ui:mt-2">
            {renderSlot(SearchBar)}
          </div>
        )}
        <>{props.children}</>
        <div className="pcgl-header-end ui:flex ui:items-center ui:gap-4 ui:ml-auto ui:shrink-0">
          {renderedAuthComponent}
        </div>
      </header>
    </div>
  );
};

const renderSlot = <T,>(slot?: SlotProp<T>, slotProps?: T): ReactNode => {
  if (typeof slot === "function") {
    return (slot as (props?: T) => ReactNode)(slotProps);
  }
  return slot ?? null;
};

// Note: ensure the client has #app-content and #app-info ids
export const AccessibilityLinks = ({
  links,
  translator,
}: AccessibilityLinksProps) => {
  const defaultLinks: SkipLinkItem[] = [
    {
      href: "#app-content",
      label: translator
        ? translator("header.skipLinks.mainContent")
        : "Skip to main content",
    },
    {
      href: "#app-info",
      label: translator
        ? translator("header.skipLinks.about")
        : 'Skip to "About PCGL"',
    },
  ];

  const items = links ?? defaultLinks;

  return (
    <ul
      id="wb-tphp"
      data-test-id="skip-links"
      className="ui:absolute ui:text-xl ui:left-1/2 ui:z-[1000]"
    >
      {items.map((link) => (
        <li key={link.href} className="ui:list-none">
          <a
            className={headerLinkVariants({ variant: "skipLink" })}
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
  loginUrl = "https://cilogon.org/",
  loginText,
  loginLogoUrl = "https://cilogon.org/images/cilogon-logo-32x32.png",
  settingsUrl = "#settings",
  settingsLabel,
  onSettingsClick,
  SettingsSlot,
  logoutUrl = "#logout",
  logoutLabel,
  onLogout,
  LogoutSlot,
  translator,
}: HeaderAuthProps) => {
  const resolvedLoginText =
    loginText ??
    (translator ? translator("header.auth.login") : "CILogon Service");
  const resolvedSettingsLabel =
    settingsLabel ??
    (translator ? translator("header.auth.mySettings") : "My Settings");
  const resolvedLogoutLabel =
    logoutLabel ?? (translator ? translator("header.auth.logOut") : "Log Out");

  if (user?.name) {
    return (
      <div
        className="pcgl-auth ui:inline-flex ui:items-center ui:relative"
        data-test-id="pcgl-auth"
      >
        <details
          className="pcgl-auth-details ui:relative ui:inline-block ui:rounded-md ui:bg-white ui:p-1 ui:outline ui:outline-black/5 ui:group ui:open:border-black/10 ui:open:bg-gray-100"
          data-test-id="pcgl-auth-details"
        >
          <summary
            className={`ui:flex ui:items-center ui:gap-4 ui:cursor-pointer ui:select-none ui:list-none [&::-webkit-details-marker]:ui:hidden`}
            data-test-id="pcgl-auth-summary"
            aria-label={`User menu for ${user.name}`}
          >
            <span
              className="pcgl-auth-hamburger ui:inline-flex ui:items-center ui:justify-center"
              aria-hidden
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </span>
            <span className="pcgl-auth-username ui:font-semibold ui:text-pcgl-text-dark ui:hidden ui:@md/header:inline-flex">
              {user.name}
            </span>
            <span
              className="pcgl-auth-chevron ui:inline-flex ui:items-center ui:transition-transform ui:duration-200 ui:group-open:rotate-180"
              aria-hidden="true"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </span>
          </summary>
          <div
            className="pcgl-auth-dropdown ui:absolute ui:top-[calc(100%+6px)] ui:right-0 ui:min-w-[180px] ui:bg-white ui:rounded-lg ui:outline ui:outline-black/5 ui:shadow-xl ui:py-1.5 ui:z-[1000] ui:flex ui:flex-col"
            role="menu"
          >
            {SettingsSlot ? (
              renderSlot(SettingsSlot)
            ) : (
              <a
                href={settingsUrl}
                onClick={onSettingsClick}
                className={headerLinkVariants({
                  variant: "dropdownItem",
                  className: "pcgl-auth-dropdown-item",
                })}
                role="menuitem"
              >
                {resolvedSettingsLabel}
              </a>
            )}
            <div
              className="pcgl-auth-dropdown-divider ui:h-px ui:my-1"
              role="separator"
            />
            {LogoutSlot ? (
              renderSlot(LogoutSlot)
            ) : (
              <a
                href={logoutUrl}
                onClick={onLogout}
                className={headerLinkVariants({
                  variant: "dropdownItem",
                  className: "pcgl-auth-dropdown-item",
                })}
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
    <div
      className="pcgl-auth ui:inline-flex ui:items-center ui:relative"
      data-test-id="pcgl-auth"
    >
      <a
        href={loginUrl}
        className={headerLinkVariants({
          variant: "outlined",
          className: "pcgl-auth-login-link",
        })}
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

export const Header = HeaderContainer;
export default HeaderContainer;
