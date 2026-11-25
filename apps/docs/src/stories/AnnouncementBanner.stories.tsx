import type { Meta, StoryObj } from '@storybook/react-vite';
import { AnnouncementBanner, type AnnouncementBannerProps } from '@repo/announcements';
import '@repo/ui/banner/styles.css';

const messages: Record<string, string> = {
  'banner.close': 'Close announcement',
  'banner.type.success': 'Success',
  'banner.type.info': 'Information',
  'banner.type.warning': 'Warning',
  'banner.type.error': 'Error',
};
const translator = (key: string) => messages[key] ?? key;

/**
 * Live from GitHub: shows the newest open issue labelled `announcement` that an owner, member or
 * collaborator opened with the Announcement issue form. Renders nothing when there is none.
 * Results are cached in sessionStorage for 5 minutes.
 */
const meta = {
  title: 'PCGL/AnnouncementBanner',
  component: AnnouncementBanner,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    owner: 'Pan-Canadian-Genome-Library',
    repo: 'pcgl-common-react-components',
    locale: 'en',
    translator,
  },
  argTypes: {
    locale: { control: 'inline-radio', options: ['en', 'fr'] },
    translator: { table: { disable: true } },
  },
} satisfies Meta<AnnouncementBannerProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Live: Story = {};

export const French: Story = { args: { locale: 'fr' } };
