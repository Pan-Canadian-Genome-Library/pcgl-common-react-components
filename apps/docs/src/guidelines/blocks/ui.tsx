/**
 * Small presentational pieces shared by the Guidelines pages. Every value they show comes from the
 * Token Source (`@repo/ui/tokens`); nothing here holds a colour or size of its own except the page
 * chrome (table rules, captions), which uses Role Tokens too.
 */
import type { CSSProperties, ReactNode } from 'react';
import { contrastRatio, fontFamilies, sharedColors } from '@repo/ui/tokens';

const ink = sharedColors.colorText;
const muted = sharedColors.colorTextSecondary;
const rule = sharedColors.colorBorderSecondary;

/** Opts the block out of Storybook's MDX prose styles, so token values render as they are. */
export const Block = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => (
  <div
    className="sb-unstyled"
    style={{
      fontFamily: fontFamilies.body,
      color: ink,
      fontSize: 14,
      lineHeight: '22px',
      ...style,
    }}
  >
    {children}
  </div>
);

export const Code = ({ children }: { children: ReactNode }) => (
  <code
    style={{
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      fontSize: 12,
      background: sharedColors.colorBgLayout,
      borderRadius: 4,
      padding: '1px 4px',
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </code>
);

/** Marks a value the Brand Guidelines leave open (spec: values taken from antd or chosen for WCAG). */
export const NotDefined = ({ children = 'Not defined by the Brand Guidelines' }) => (
  <span
    style={{
      display: 'inline-block',
      fontSize: 12,
      lineHeight: '20px',
      color: muted,
      border: `1px solid ${sharedColors.colorBorder}`,
      borderRadius: 4,
      padding: '0 6px',
    }}
  >
    {children}
  </span>
);

export const Chip = ({ color, size = 40 }: { color: string; size?: number }) => (
  <span
    aria-hidden
    style={{
      display: 'inline-block',
      width: size,
      height: size,
      borderRadius: 6,
      background: color,
      boxShadow: `inset 0 0 0 1px ${sharedColors.colorBorder}`,
      flexShrink: 0,
    }}
  />
);

/** A contrast ratio with the WCAG 2.2 AA level it reaches. */
export const Ratio = ({ fg, bg }: { fg: string; bg: string }) => {
  const ratio = contrastRatio(fg, bg);
  const level = ratio >= 4.5 ? 'text' : ratio >= 3 ? 'large text, UI' : 'decorative only';
  return (
    <span style={{ whiteSpace: 'nowrap' }}>
      <strong style={{ fontWeight: 600 }}>{ratio.toFixed(2)}:1</strong>{' '}
      <span style={{ color: muted }}>({level})</span>
    </span>
  );
};

/** One line of a pairing: `fg` drawn on `bg`, with the minimum the pairing must reach. */
export interface Pairing {
  label: ReactNode;
  fg: string;
  bg: string;
  minimum: 3 | 4.5;
}

export const PairingTable = ({ pairings }: { pairings: Pairing[] }) => (
  <Table head={['Pairing', 'Sample', 'Contrast', 'Needs', 'Result']}>
    {pairings.map(({ label, fg, bg, minimum }, index) => {
      const ratio = contrastRatio(fg, bg);
      return (
        <Row key={index}>
          <Cell>{label}</Cell>
          <Cell>
            <span
              style={{
                display: 'inline-block',
                background: bg,
                color: fg,
                padding: '2px 8px',
                borderRadius: 4,
                boxShadow: `inset 0 0 0 1px ${sharedColors.colorBorderSecondary}`,
                fontWeight: 600,
              }}
            >
              Aa
            </span>
          </Cell>
          <Cell>{ratio.toFixed(2)}:1</Cell>
          <Cell>{minimum}:1</Cell>
          <Cell>{ratio >= minimum ? 'Passes' : 'Fails'}</Cell>
        </Row>
      );
    })}
  </Table>
);

/** A table of `Row`s under a header row of plain labels. */
export const Table = ({ head, children }: { head: string[]; children: ReactNode }) => (
  <div style={{ overflowX: 'auto', margin: '16px 0 24px' }}>
    <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 14, lineHeight: '22px' }}>
      <thead>
        <tr>
          {head.map((label, index) => (
            <th
              key={index}
              scope="col"
              style={{
                textAlign: 'left',
                fontWeight: 600,
                padding: '8px 12px',
                borderBottom: `1px solid ${sharedColors.colorBorder}`,
                whiteSpace: 'nowrap',
              }}
            >
              {label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  </div>
);

export const Row = ({ children }: { children: ReactNode }) => <tr>{children}</tr>;

export const Cell = ({ children }: { children?: ReactNode }) => (
  <td style={{ padding: '8px 12px', borderBottom: `1px solid ${rule}`, verticalAlign: 'middle' }}>
    {children}
  </td>
);
