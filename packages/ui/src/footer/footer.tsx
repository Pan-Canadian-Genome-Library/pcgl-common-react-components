import { type ComponentPropsWithRef, type CSSProperties } from 'react';
import FOOTER_DATA from './data.json';
import fundersLogo from './funders.svg';
import styles from './footer.module.css';

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
    <footer data-test-id="pcgl-footer" className={styles['pcgl-footer']} data-brand-color={brand} style={{...footerStyle, ...style}} ref={ref}>
      <>{ ContextualBand }</>
      <div className={styles['main-band']}>
        <FooterView sections={data} />
        <div className={styles.meta}>
          <LinkHeader>{translator('footer.meta.funding_title')}</LinkHeader>
          <img className={styles['meta-logo']} src={fundersLogo} role="presentation" alt="" width={423} height={95} />
          <p>{translator('footer.meta.cihr_support')}</p>
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
      className={`${styles['focus-ring']} ${styles['link-item']}`}
      href={url}
      target={linkTarget}
      rel={linkTarget === '_blank' ? 'noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  );
};

const LinkHeader = ({ children }: { children: React.ReactNode }) => <h3 className={styles.title}>{children}</h3>;

const FooterView = ({ sections }: { sections: FooterNavItems[] }) => {
  return (
    <>
      {sections.map((section) => (
        <dl key={section.title} className={styles['links-section']}>
          <dt>{section.title}</dt>
          <dd className={styles.group}>
            <ul>
              {section.items.map((item) => (
                <li key={`${item.link}-${item.url}`} className={styles.item}>
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