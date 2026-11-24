/** Blocks for the Typography page, rendered from the Token Source. */
import { fontFamilies, fontWeights, textStyles, type TextStyleName } from '@repo/ui/tokens';
import { Block, Cell, Code, Row, Table } from './ui';

/** antd's token names and the Tailwind utilities for each text style. */
const names: Record<TextStyleName, { antd: string; utility: string; size: string }> = {
  heading1: {
    antd: 'fontSizeHeading1 / lineHeightHeading1',
    utility: 'heading-1',
    size: 'text-4xl',
  },
  heading2: {
    antd: 'fontSizeHeading2 / lineHeightHeading2',
    utility: 'heading-2',
    size: 'text-3xl',
  },
  heading3: {
    antd: 'fontSizeHeading3 / lineHeightHeading3',
    utility: 'heading-3',
    size: 'text-2xl',
  },
  heading4: {
    antd: 'fontSizeHeading4 / lineHeightHeading4',
    utility: 'heading-4',
    size: 'text-xl',
  },
  heading5: {
    antd: 'fontSizeHeading5 / lineHeightHeading5',
    utility: 'heading-5',
    size: 'text-base',
  },
  body: { antd: 'fontSize / lineHeight', utility: 'body-text', size: 'text-sm' },
  small: { antd: 'fontSizeSM / lineHeightSM', utility: 'small-text', size: 'text-xs' },
};

const styleNames = Object.keys(textStyles) as TextStyleName[];

/**
 * Each text style, drawn with its Tailwind text-style utility from the Research stylesheet that
 * Storybook loads, next to the Token Source values it is generated from.
 */
export const TypeScale = () => (
  <Block>
    {styleNames.map((name) => {
      const style = textStyles[name];
      return (
        <div
          key={name}
          style={{ padding: '16px 0', borderBottom: '1px solid rgba(0, 0, 0, 0.06)' }}
        >
          <div className={names[name].utility}>The Pan-Canadian Genome Library</div>
          <div style={{ fontSize: 12, lineHeight: '20px', marginTop: 4 }}>
            <Code>{names[name].utility}</Code> · {style.fontSize}/{style.lineHeight}px (
            {style.fontSize / 16}rem) · weight {style.fontWeight} · {style.fontFamily} family
          </div>
        </div>
      );
    })}
  </Block>
);

export const TypeTable = () => (
  <Block>
    <Table
      head={['Style', 'antd tokens', 'Tailwind', 'Size / line height', 'Ratio', 'Weight', 'Family']}
    >
      {styleNames.map((name) => {
        const style = textStyles[name];
        return (
          <Row key={name}>
            <Cell>{name}</Cell>
            <Cell>
              <Code>{names[name].antd}</Code>
            </Cell>
            <Cell>
              <Code>{names[name].utility}</Code> or <Code>{names[name].size}</Code>
            </Cell>
            <Cell>
              {style.fontSize}/{style.lineHeight}px, {style.fontSize / 16}rem
            </Cell>
            <Cell>{(style.lineHeight / style.fontSize).toFixed(2)}</Cell>
            <Cell>{style.fontWeight}</Cell>
            <Cell>{style.fontFamily}</Cell>
          </Row>
        );
      })}
    </Table>
  </Block>
);

export const FontFamilies = () => (
  <Block>
    <Table head={['Token', 'Tailwind', 'Sample', 'Value']}>
      {(Object.keys(fontFamilies) as (keyof typeof fontFamilies)[]).map((name) => (
        <Row key={name}>
          <Cell>
            <Code>{name}</Code>
          </Cell>
          <Cell>
            <Code>font-{name}</Code>
          </Cell>
          <Cell>
            <span
              style={{
                fontFamily: fontFamilies[name],
                fontSize: 20,
                fontWeight: fontWeights.strong,
              }}
            >
              Genome Aa 123
            </span>
          </Cell>
          <Cell>
            <span style={{ fontSize: 12 }}>{fontFamilies[name]}</span>
          </Cell>
        </Row>
      ))}
    </Table>
    <Table head={['Weight token', 'Value', 'Used for']}>
      <Row>
        <Cell>
          <Code>regular</Code>
        </Cell>
        <Cell>{fontWeights.regular}</Cell>
        <Cell>Body and small text</Cell>
      </Row>
      <Row>
        <Cell>
          <Code>strong</Code>
        </Cell>
        <Cell>{fontWeights.strong}</Cell>
        <Cell>Every heading and strong text (antd's fontWeightStrong)</Cell>
      </Row>
    </Table>
  </Block>
);
