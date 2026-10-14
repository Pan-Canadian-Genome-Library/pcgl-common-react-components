import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { createRef } from 'react';
import { FooterContainer } from '../footer';

describe('FooterContainer', () => {
  const mockTranslator = (key: string) => {
    const translations: Record<string, string> = {
      'footer.sections.about': 'About Us',
      'footer.links.privacy': 'Privacy Policy',
      'footer.urls.privacy': 'https://example.com/privacy',
      'footer.links.termsConditions': 'Terms',
      'footer.urls.termsConditions': '/terms',
      'footer.meta.funding_title': 'Supported By',
      'footer.meta.cihr_support': 'Funded by CIHR',
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
  });

  it('handles external vs internal links correctly', () => {
    render(<FooterContainer translator={mockTranslator} />);

    const externalLink = screen.getByRole('link', { name: 'Privacy Policy' });
    expect(externalLink).toHaveAttribute('href', 'https://example.com/privacy');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noreferrer');

    const internalLink = screen.getByRole('link', { name: 'Terms' });
    expect(internalLink).toHaveAttribute('href', '/terms');
    expect(internalLink).not.toHaveAttribute('target');
    expect(internalLink).not.toHaveAttribute('rel');
  });

  it('renders ContextualBand and PortalBand in the proper slots', () => {
    render(
      <FooterContainer
        translator={mockTranslator}
        ContextualBand={<div data-test-id="context-band">Context</div>}
        PortalBand={<div data-test-id="portal-band">Portal</div>}
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
