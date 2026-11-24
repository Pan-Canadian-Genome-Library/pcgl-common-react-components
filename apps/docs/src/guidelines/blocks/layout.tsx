/** Blocks for the Layout, Radius and Shadows pages, rendered from the Token Source. */
import { breakpoints, radius, shadows, sharedColors, spacing } from '@repo/ui/tokens';
import { Block, Cell, Code, Row, Table } from './ui';

const upper = (word: string) => word.toUpperCase();

/** Token Source spacing key -> antd's size token. */
const antdSize = (key: keyof typeof spacing): string =>
  key === 'base' ? 'size' : key === 'unit' ? 'sizeUnit' : `size${upper(key)}`;

export const SpacingScale = () => (
  <Block>
    <Table head={['antd token', 'Tailwind step', 'px', 'rem', 'Sample']}>
      {(Object.keys(spacing) as (keyof typeof spacing)[]).map((key) => (
        <Row key={key}>
          <Cell>
            <Code>{antdSize(key)}</Code>
          </Cell>
          <Cell>
            <Code>
              {key === 'unit' ? '--spacing' : `p-${spacing[key] / 4}, gap-${spacing[key] / 4}, …`}
            </Code>
          </Cell>
          <Cell>{spacing[key]}</Cell>
          <Cell>{spacing[key] / 16}rem</Cell>
          <Cell>
            <span
              aria-hidden
              style={{
                display: 'inline-block',
                width: spacing[key],
                height: 16,
                background: sharedColors.colorPrimaryBgHover,
                boxShadow: `inset 0 0 0 1px ${sharedColors.colorBorder}`,
              }}
            />
          </Cell>
        </Row>
      ))}
    </Table>
  </Block>
);

/** Tailwind's variant name for each antd breakpoint (antd's `xxl` is Tailwind's `2xl`). */
const tailwindBreakpoint: Record<keyof typeof breakpoints, string> = {
  sm: 'sm',
  md: 'md',
  lg: 'lg',
  xl: 'xl',
  xxl: '2xl',
};

export const Breakpoints = () => (
  <Block>
    <Table head={['antd token', 'Tailwind variant', 'Min width', 'rem']}>
      {(Object.keys(breakpoints) as (keyof typeof breakpoints)[]).map((key) => (
        <Row key={key}>
          <Cell>
            <Code>screen{upper(key)}</Code>
          </Cell>
          <Cell>
            <Code>{tailwindBreakpoint[key]}:</Code>
          </Cell>
          <Cell>{breakpoints[key]}px</Cell>
          <Cell>{breakpoints[key] / 16}rem</Cell>
        </Row>
      ))}
    </Table>
  </Block>
);

const tailwindRadius: Record<keyof typeof radius, string> = {
  borderRadiusXS: 'rounded-xs',
  borderRadiusSM: 'rounded-sm',
  borderRadius: 'rounded-md',
  borderRadiusLG: 'rounded-lg',
};

export const RadiusScale = () => (
  <Block>
    <Table head={['antd token', 'Tailwind', 'px', 'Sample']}>
      {(Object.keys(radius) as (keyof typeof radius)[]).map((key) => (
        <Row key={key}>
          <Cell>
            <Code>{key}</Code>
          </Cell>
          <Cell>
            <Code>{tailwindRadius[key]}</Code>
          </Cell>
          <Cell>{radius[key]}</Cell>
          <Cell>
            <span
              aria-hidden
              style={{
                display: 'inline-block',
                width: 64,
                height: 40,
                borderRadius: radius[key],
                border: `1px solid ${sharedColors.colorBorder}`,
                background: sharedColors.colorBgLayout,
              }}
            />
          </Cell>
        </Row>
      ))}
    </Table>
  </Block>
);

const tailwindShadow: Record<keyof typeof shadows, string> = {
  boxShadow: 'shadow-md',
  boxShadowSecondary: 'shadow-md',
  boxShadowTertiary: 'shadow-sm',
};

const shadowNames = Object.keys(shadows) as (keyof typeof shadows)[];

export const ShadowScale = () => (
  <Block>
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 32,
        padding: '24px 16px',
        background: sharedColors.colorBgLayout,
        borderRadius: 8,
      }}
    >
      {shadowNames.map((key) => (
        <div
          key={key}
          style={{
            width: 220,
            padding: 16,
            borderRadius: 8,
            background: sharedColors.colorBgElevated,
            boxShadow: shadows[key],
          }}
        >
          <div>
            <Code>{key}</Code>
          </div>
          <div>
            Tailwind <Code>{tailwindShadow[key]}</Code>
          </div>
        </div>
      ))}
    </div>
    <Table head={['antd token', 'Tailwind', 'Value']}>
      {shadowNames.map((key) => (
        <Row key={key}>
          <Cell>
            <Code>{key}</Code>
          </Cell>
          <Cell>
            <Code>{tailwindShadow[key]}</Code>
          </Cell>
          <Cell>
            <span style={{ fontSize: 12 }}>{shadows[key]}</span>
          </Cell>
        </Row>
      ))}
    </Table>
  </Block>
);
