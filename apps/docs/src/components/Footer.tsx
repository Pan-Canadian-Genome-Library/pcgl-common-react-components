import { FooterContainer, LinkItem } from '@repo/ui/footer';

// Given that we don't have some of the data in the moment we define a temporary data
const footerItems = [
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
];
const t = (s: string) => {
  const labels = {
    footer: {
      bento: {
        c3g_copyright: '© C3G Copyright',
        powered_by: 'The PCGL research portal is powered by',
        copyright: '©',
        bento: 'the Bento platform',
        terms_of_use: 'Terms of Use',
        licensed_under: 'Bento is licensed under the',
        source_available: 'The source code is available on',
        admin_link: 'Admin',
      },
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
        contact: 'https://genomelibrary.ca/contact-us',
        subscribe: 'https://genomelibrary.ca/subscribe',
        linkedin: 'https://www.linkedin.com/company/genome-library',
      },
    },
  };
  const value = s.split('.').reduce((obj: any, key) => obj?.[key], labels);
  return value;
};

export const Footer = () => {
  return <FooterContainer translator={t} PortalBand={<BentoBand />} footerItems={footerItems} />;
};

const BentoBand = () => {
  return (
    <div className="bento-footer">
      <div className="about">
        <p>{t('footer.bento.powered_by')} </p>
        <LinkItem href="https://bento-platform.github.io">
          <img
            src="https://bento-platform.github.io/images/bento-icon.png"
            width={288}
            height={68}
            className="bento-logo"
            alt={t('footer.bento.bento')}
          />
        </LinkItem>
      </div>
      <ul className="links">
        <li>
          <LinkItem href="/public/terms.html">{t('footer.bento.terms_of_use')}</LinkItem>
        </li>
        <li>
          <LinkItem href="https://computationalgenomics.ca" aria-label={t('footer.c3g')}>
            C3G
          </LinkItem>
        </li>
      </ul>
      <p className="legal">
        {t('footer.bento.licensed_under')}
        <LinkItem href="https://github.com/bento-platform/bento_public/blob/main/LICENSE">
          LGPLv3
        </LinkItem>
        {'. '}
        {t('footer.bento.source_available')}
        <LinkItem href="https://github.com/bento-platform">Github</LinkItem>.
      </p>
      <p className="c3g">
        <span>© C3G, {new Date().getFullYear()}</span>
      </p>
    </div>
  );
};

export default Footer;
