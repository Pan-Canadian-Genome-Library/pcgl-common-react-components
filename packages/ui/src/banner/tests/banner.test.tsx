import '@testing-library/jest-dom/vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { Banner, type Announcement } from '..';

const messages: Record<string, string> = {
  'banner.close': 'Close announcement',
  'banner.type.success': 'Success',
  'banner.type.info': 'Information',
  'banner.type.warning': 'Warning',
  'banner.type.error': 'Error',
};
const translator = (key: string) => messages[key] ?? key;

const maintenance: Announcement = {
  id: 'test-maintenance',
  type: 'warning',
  defaultLocale: 'en',
  translations: {
    en: { title: 'Scheduled maintenance', description: 'Some services may be unavailable.' },
    fr: {
      title: 'Maintenance planifiée',
      description: 'Certains services peuvent être indisponibles.',
    },
  },
};

describe('@repo/ui/banner', () => {
  it('shows the type label, title and description in the requested locale', () => {
    render(<Banner announcement={maintenance} locale="fr" translator={translator} />);

    expect(screen.getByText('Warning:')).toBeVisible();
    expect(screen.getByText('Maintenance planifiée')).toBeVisible();
    expect(screen.getByText('Certains services peuvent être indisponibles.')).toBeVisible();
  });

  it('falls back to the default locale when the requested locale has no text', () => {
    render(<Banner announcement={maintenance} locale="es" translator={translator} />);

    expect(screen.getByText('Scheduled maintenance')).toBeVisible();
  });

  it('renders nothing when neither the requested nor the default locale has text', () => {
    const { container } = render(
      <Banner
        announcement={{ ...maintenance, defaultLocale: 'de' }}
        locale="es"
        translator={translator}
      />,
    );

    expect(container).toBeEmptyDOMElement();
  });

  it.each([
    ['error', 'alert'],
    ['warning', 'alert'],
    ['success', 'status'],
    ['info', 'status'],
  ] as const)('announces a %s Announcement with role="%s"', (type, role) => {
    render(<Banner announcement={{ ...maintenance, type }} locale="en" translator={translator} />);

    expect(screen.getByRole(role)).toHaveTextContent('Scheduled maintenance');
  });

  it('removes itself and calls onClose when the user closes it', () => {
    const onClose = vi.fn();
    render(
      <Banner announcement={maintenance} locale="en" translator={translator} onClose={onClose} />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Close announcement' }));

    expect(screen.queryByText('Scheduled maintenance')).not.toBeInTheDocument();
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('moves focus to the main content after closing', () => {
    render(
      <>
        <Banner announcement={maintenance} locale="en" translator={translator} />
        <main>Page content</main>
      </>,
    );

    const close = screen.getByRole('button', { name: 'Close announcement' });
    close.focus();
    fireEvent.click(close);

    expect(screen.getByRole('main')).toHaveFocus();
  });

  it('shows again when a different Announcement replaces a closed one', () => {
    const { rerender } = render(
      <Banner announcement={maintenance} locale="en" translator={translator} />,
    );
    fireEvent.click(screen.getByRole('button', { name: 'Close announcement' }));

    const outage: Announcement = {
      id: 'test-outage',
      type: 'error',
      defaultLocale: 'en',
      translations: { en: { title: 'Service outage', description: 'We are on it.' } },
    };
    rerender(<Banner announcement={outage} locale="en" translator={translator} />);

    expect(screen.getByText('Service outage')).toBeVisible();
  });

  it.each(['success', 'info', 'warning', 'error'] as const)(
    'has no detectable accessibility violations for a %s Announcement',
    async (type) => {
      const { container } = render(
        <Banner announcement={{ ...maintenance, type }} locale="en" translator={translator} />,
      );

      expect(await axe(container)).toHaveNoViolations();
    },
  );
});
