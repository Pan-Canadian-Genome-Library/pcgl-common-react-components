import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { FooterContainer } from '../footer';

describe('FooterContainer', () => {
  const mockTranslator = (key: string) => {
    const translations: Record<string, string> = {
      'footer.section.about': 'About Us',
      'footer.label.dacoPlatform': 'DACO Platform',
      'footer.href.dacoPlatform': 'https://example.com/daco',
      'footer.label.researchPlatform': 'Research Portal',
      'footer.href.researchPlatform': '/rportal',
      'footer.meta.fundingTitle': 'Supported By',
      'footer.meta.cihrSupport': 'Funded by CIHR',
    };
    return translations[key] ?? key;
  };

  it('renders correctly with default brand and calls translator', () => {
    const { container } = render(<FooterContainer translator={mockTranslator} />);
    const footer = screen.getByTestId('pcgl-footer');

    expect(footer).toBeInTheDocument();
    expect(footer).toHaveAttribute('data-brand-color', '#054A74');
    expect(footer.style.getPropertyValue('--brand-color')).toBe('#054A74');
    expect(screen.getByText('About Us')).toBeInTheDocument();
    expect(screen.getByText('Supported By')).toBeInTheDocument();
    return container;
  });

  it('handles external vs internal links correctly', () => {
    render(<FooterContainer translator={mockTranslator} />);

    const externalLink = screen.getByRole('link', { name: 'DACO Platform' });
    expect(externalLink).toHaveAttribute('href', 'https://example.com/daco');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noreferrer');

    const internalLink = screen.getByRole('link', { name: 'Research Portal' });
    expect(internalLink).toHaveAttribute('href', '/rportal');
    expect(internalLink).not.toHaveAttribute('target');
    expect(internalLink).not.toHaveAttribute('rel');
  });

  it('renders ContextualBand and PortalBand in the proper slots', () => {
    render(
      <FooterContainer
        translator={mockTranslator}
        ContextualBand={<div data-test-id="context-band">Context</div>}
        PortalBand={<div data-test-id="portal-band">Portal</div>}
        footerItems={[]}
      />
    );

    expect(screen.getByTestId('context-band')).toBeInTheDocument();
    expect(screen.getByTestId('portal-band')).toBeInTheDocument();
  });

  it('forwards ref and custom brand color', () => {
    const ref = createRef<HTMLElement>();
    render(<FooterContainer ref={ref} brand="#123456" translator={mockTranslator} />);

    expect(ref.current).toBeInstanceOf(HTMLElement);
    expect(ref.current).toHaveAttribute('data-brand-color', '#123456');
  });
});
