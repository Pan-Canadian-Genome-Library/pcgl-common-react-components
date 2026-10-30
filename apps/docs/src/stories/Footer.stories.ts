import type { Meta, StoryObj } from '@storybook/react-vite';
import { FooterContainer, type FooterProps } from '@repo/ui/footer';

const meta = {
  title: 'PCGL/Footer',
  component: FooterContainer,
  tags: ['autodocs'],
  argTypes: {
    brand: {
      control: {
        type: 'color',
        presetColors: ['#054A74', '#929497', '#761248', '#EC1C24'],
      },
    },
  },
} satisfies Meta<FooterProps>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    brand: '#929497',
    translator: (s) => s,
    ContextualBand: undefined,
    PortalBand: undefined,
    footerItems: undefined,
  },
};

export const PCGLResearchPortal: Story = {
  args: {
    translator: (s: string) => {
      const labels = {
        footer: {
          meta: {
            fundingTitle: 'Acknowledgement of funding',
            logoText: 'Pan-Canadian Genome Library logo',
            cihrLogoText: 'Canadian Institutes of Health Research logo',
            cihrSupport: 'PCGL is supported by the Canadian Institutes of Health Research (CIHR).',
          },
          section: {
            about: 'About PCGL',
            resources: 'Resources & Documentation',
            connect: 'Connect with us',
          },
          label: {
            pcglWebsite: 'PCGL Website',
            publicationPolicy: 'Publication Policy',
            helpGuides: 'Help Guides',
            contact: 'Contact Us',
            subscribe: 'Subscribe to our mailing list',
            linkedin: 'LinkedIn',
          },
          href: {
            pcglWebsite: 'https://genomelibrary.ca',
            publicationPolicy:
              'https://pan-canadian-genome-library.github.io/researcher/publications-policies',
            helpGuides: 'https://pan-canadian-genome-library.github.io/researcher/docs',
            contact: 'https://www.genomelibrary.ca/contact-us',
            subscribe: 'https://genomelibrary.ca/subscribe',
            linkedin: 'https://www.linkedin.com/company/genome-library',
          },
        },
      };
      const value = s.split('.').reduce((obj: any, key) => obj?.[key], labels);
      return value;
    },
    footerItems: [
      {
        title: 'about',
        items: [
          { label: 'pcglWebsite', href: 'pcglWebsite' },
          { label: 'publicationPolicy', href: 'publicationPolicy' },
          { label: 'helpGuides', href: 'helpGuides' },
        ],
      },
      {
        title: 'connect',
        items: [
          { label: 'contact', href: 'contact' },
          { label: 'subscribe', href: 'subscribe' },
          { label: 'linkedin', href: 'linkedin' },
        ],
      },
    ],
  },
};
