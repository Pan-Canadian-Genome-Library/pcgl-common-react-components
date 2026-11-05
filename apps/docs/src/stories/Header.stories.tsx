import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Header,
  HeaderButton,
  HeaderLanguageToggle,
  HeaderNavLink,
  HeaderUserMenu,
  HeaderUserMenuItem,
  type HeaderProps,
} from '@repo/ui/header';
import '@repo/ui/header/styles.css';

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

/** app's resources */
const Logo = () => (
  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 28, lineHeight: 1 }}>
    PCGL
    <span style={{ fontSize: 11, lineHeight: 1.1 }}>
      Research
      <br />
      Portal
    </span>
  </span>
);

const nav = (
  <>
    <HeaderNavLink href="#policies">Policies & Guidelines</HeaderNavLink>
    <HeaderNavLink href="#help">Help Guides</HeaderNavLink>
    <HeaderNavLink href="#users">Controlled Data Users</HeaderNavLink>
  </>
);

const language = (
  <HeaderLanguageToggle lang="fr" shortLabel="FR">
    Français
  </HeaderLanguageToggle>
);

const meta = {
  title: 'PCGL/Header',
  component: Header,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: { logo: <Logo />, translator, nav, language },
  argTypes: {
    brand: {
      control: { type: 'color', presetColors: ['#761248', '#054A74', '#929497', '#EC1C24'] },
    },
  },
  render: (args) => (
    <>
      <Header {...args} />
      <main id="main" style={{ padding: 32 }}>
        Page content. Press Tab from the top of the page to reveal the skip links.
      </main>
      <footer id="footer" style={{ padding: 32 }}>
        Footer
      </footer>
    </>
  ),
} satisfies Meta<HeaderProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const LoggedOut: Story = {
  args: {
    actions: (
      <HeaderButton onClick={() => alert('Open the Apply for access modal')}>Register</HeaderButton>
    ),
    account: (
      <HeaderButton variant="primary" href="#login">
        Login
      </HeaderButton>
    ),
    brand: '#761248',
  },
};

export const LoggedIn: Story = {
  args: {
    actions: <HeaderNavLink href="#dashboard">My Applications</HeaderNavLink>,
    account: (
      <HeaderUserMenu name="Jane Long Name Example" email="j.longname@oicr.on.ca">
        <HeaderUserMenuItem onClick={() => alert('Logout')}>Logout</HeaderUserMenuItem>
      </HeaderUserMenu>
    ),
    brand: '#054A74',
  },
};

/** Bento example: menu items with a current page, email only, and a loading sign-in button. */
export const MenuItemsEmailOnlyAndLoading: Story = {
  args: {
    nav: (
      <>
        <HeaderNavLink href="#overview" current>
          Explore
        </HeaderNavLink>
        <HeaderNavLink href="#search">Beacon</HeaderNavLink>
        <HeaderNavLink href="#beacon">About</HeaderNavLink>
      </>
    ),
    language: (
      <HeaderLanguageToggle lang="fr" shortLabel="FR">
        Français
      </HeaderLanguageToggle>
    ),
    account: (
      <HeaderButton variant="primary" loading>
        Sign In
      </HeaderButton>
    ),
  },
};

export const MobileLoggedIn: Story = {
  ...LoggedIn,
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
export const MobileLoggedOut: Story = {
  ...LoggedOut,
  globals: { viewport: { value: 'mobile1', isRotated: false } },
};
