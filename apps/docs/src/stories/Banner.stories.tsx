import type { Meta, StoryObj } from '@storybook/react-vite';
import { Banner, defaultAnnouncements, type BannerProps } from '@repo/ui/banner';
import { Header } from '@repo/ui/header';
import '@repo/ui/banner/styles.css';
import '@repo/ui/header/styles.css';

const messages: Record<string, string> = {
  'banner.close': 'Close announcement',
  'banner.type.success': 'Success',
  'banner.type.info': 'Information',
  'banner.type.warning': 'Warning',
  'banner.type.error': 'Error',
  'header.skipLinks.main': 'Skip to main content',
  'header.skipLinks.footer': 'Skip to footer',
  'header.home': 'PCGL Research Portal home',
  'header.nav': 'Main',
};
const translator = (key: string) => messages[key] ?? key;

const meta = {
  title: 'PCGL/Banner',
  component: Banner,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    announcement: defaultAnnouncements.info,
    locale: 'en',
    translator,
  },
  argTypes: {
    locale: { control: 'inline-radio', options: ['en', 'fr'] },
    translator: { table: { disable: true } },
  },
} satisfies Meta<BannerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Info: Story = {};

export const Resolved: Story = { args: { announcement: defaultAnnouncements.resolved } };

export const Disruption: Story = { args: { announcement: defaultAnnouncements.disruption } };

export const Outage: Story = { args: { announcement: defaultAnnouncements.outage } };

export const Maintenance: Story = { args: { announcement: defaultAnnouncements.maintenance } };

export const French: Story = {
  args: { announcement: defaultAnnouncements.maintenance, locale: 'fr' },
};

/** Pass the Banner through Header's `banner` slot so the skip links stay first in tab order. */
export const InHeader: Story = {
  args: { announcement: defaultAnnouncements.outage },
  render: (args) => (
    <>
      <Header logo={<span>PCGL</span>} translator={translator} banner={<Banner {...args} />} />
      <main id="main-content" style={{ padding: 32 }}>
        Page content
      </main>
    </>
  ),
};
