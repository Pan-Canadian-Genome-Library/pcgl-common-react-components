/**
 * Small presentational pieces shared by the Guidelines pages. The page chrome (table rules,
 * captions) uses the Tailwind utilities generated from the Token Source; values that depend on the
 * token being shown are passed through `style`.
 */
import type { ReactNode } from 'react';
import { contrastRatio } from '@repo/ui/tokens';

/** Opts the block out of Storybook's MDX prose styles, so token values render as they are. */
export const Block = ({ children }: { children: ReactNode }) => (
  <div className="sb-unstyled body-text">{children}</div>
);

export const Code = ({ children }: { children: ReactNode }) => (
  <code className="rounded-sm bg-bg-layout px-1 font-mono text-xs whitespace-nowrap">
    {children}
  </code>
);

/**
 * Marks a value the Brand Guidelines leave open (spec: values taken from antd or chosen for WCAG).
 * Opts out of the prose styles itself, because MDX pages also use it outside a `Block`.
 */
export const NotDefined = ({ children = 'Not defined by the Brand Guidelines' }) => (
  <span className="sb-unstyled inline-block rounded-sm border border-border px-2 text-xs text-text-secondary">
    {children}
  </span>
);

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
              className="inline-block rounded-sm px-2 font-semibold ring-1 ring-border-secondary ring-inset"
              style={{ background: bg, color: fg }}
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
  <div className="mt-4 mb-6 overflow-x-auto">
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr>
          {head.map((label, index) => (
            <th
              key={index}
              scope="col"
              className="border-b border-border px-3 py-2 text-left font-semibold whitespace-nowrap"
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
  <td className="border-b border-border-secondary px-3 py-2 align-middle">{children}</td>
);
