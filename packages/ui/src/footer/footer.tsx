import { type ComponentPropsWithRef, type CSSProperties } from 'react';
import FOOTER_DATA from './data.json';
import fundersLogo from './funders.svg';
import './footer.css';

export type FooterNavItem = { link: string; url: string };
export type FooterNavItems = { title: string; items: FooterNavItem[] };
export type LinkItemProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { url: string };
export interface FooterProps extends ComponentPropsWithRef<'footer'> {
  ContextualBand?: React.ReactNode;
  PortalBand?: React.ReactNode;
  brand?: string;
  translator: (s:string) => string;
};
interface CustomStyles extends CSSProperties {
  '--brand-color'?: string;
}

export const FooterContainer = ({ ContextualBand, PortalBand, brand='#054A74', translator, ...props }: FooterProps) => {
  const {ref, style} = props;
  const footerStyle: CustomStyles = {
    '--brand-color': brand,
  }

  const data = Array.from(FOOTER_DATA, (link) => ({
    title: translator(`footer.sections.${link.title}`),
    items: link.items.map((item) => ({
      link: translator(`footer.links.${item.link}`),
      url: translator(`footer.urls.${item.url}`),
    })),
  }));

  return (
    <footer data-test-id="pcgl-footer" className="pcgl-footer" data-brand-color={brand} style={{...footerStyle, ...style}} ref={ref}>
      <>{ ContextualBand }</>
      <div className="main-band">
        <FooterView sections={data} />
        <div className="meta">
          <LinkHeader>{translator('footer.meta.fundingTitle')}</LinkHeader>
          <img className="meta-logo" src={fundersLogo} role="presentation" alt="" width={423} height={95} />
          <p>{translator('footer.meta.cihrSupport')}</p>
        </div>
      </div>
      <>{ PortalBand }</>
    </footer>
  );
};

const LinkItem = ({ children, url, target, ...props }: LinkItemProps) => {
  const isExternal = url.startsWith('http');
  const linkTarget = target ?? (isExternal ? '_blank' : undefined);
  return (
    <a
      className="focus-ring link-item"
      href={url}
      target={linkTarget}
      rel={linkTarget === '_blank' ? 'noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  );
};

const LinkHeader = ({ children }: { children: React.ReactNode }) => <h3 className="title">{children}</h3>;

const FooterView = ({ sections }: { sections: FooterNavItems[] }) => {
  return (
    <>
      {sections.map((section) => (
        <dl key={section.title} className="links-section">
          <dt>{section.title}</dt>
          <dd className="group">
            <ul>
              {section.items.map((item) => (
                <li key={`${item.link}-${item.url}`} className="item">
                  <LinkItem url={item.url}>{item.link}</LinkItem>
                </li>
              ))}
            </ul>
          </dd>
        </dl>
      ))}
    </>
  );
};

export default FooterContainer;