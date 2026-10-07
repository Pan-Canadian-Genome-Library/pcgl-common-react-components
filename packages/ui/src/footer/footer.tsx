import FOOTER_DATA from './data.json';
import './styles.css';

type FooterNavItem = { link: string; url: string };
type FooterNavItems = { title: string; items: FooterNavItem[] };
type LinkItemProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & { url: string };
export type FooterContainerProps = {
  ContextualBand?: React.ReactNode;
  PortalBand?: React.ReactNode;
};

export const FooterContainer = ({ ContextualBand, PortalBand }: FooterContainerProps) => {
  const t = (s:string) => s;

  const data = Array.from(FOOTER_DATA, (link) => ({
    title: t(`footer.sections.${link.title}`),
    items: link.items.map((item) => ({
      link: t(`footer.links.${item.link}`),
      url: t(`footer.urls.${item.url}`),
    })),
  }));

  return (
    <footer className="pcgl-footer">
      <>{ ContextualBand }</>
      <div className="main-band">
        <FooterView sections={data} />
        <div className="meta">
          <LinkHeader>{t('footer.meta.funding_title')}</LinkHeader>
          <img className="meta-logo" src="./funders.svg" role="presentation" alt="" width={423} height={95} />
          <p>{t('footer.meta.cihr_support')}</p>
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