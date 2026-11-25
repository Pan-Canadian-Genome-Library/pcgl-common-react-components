import type { ReactNode } from 'react';
import { ColorItem, ColorPalette } from '@storybook/addon-docs/blocks';
import {
  brandPalette,
  contrastRatio,
  focusRing,
  sharedColors,
  statuses,
  themes,
  type BrandColor,
  type SharedColorName,
  type Status,
  type Theme,
  type ThemeName,
} from '@repo/ui/tokens';
import { FooterContainer } from '@repo/ui/footer';
import { Header, HeaderButton, HeaderNavLink } from '@repo/ui/header';
import '@repo/ui/header/styles.css';
import { toHex, toHexOnWhite, toHsl } from './color-format';
import { Block, Cell, Code, NotDefined, PairingTable, Row, Table, type Pairing } from './ui';

const white = sharedColors.colorBgContainer;
const themeNames = Object.keys(themes) as ThemeName[];

/** `colorPrimaryBgHover` -> `primary-bg-hover`: the Tailwind colour name of an antd Role Token. */
const tailwindName = (antdName: string): string =>
  antdName
    .replace(/^color/, '')
    .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    .slice(1);

const kebab = (name: string): string => name.replace(/[A-Z]/g, (l) => `-${l.toLowerCase()}`);

/* ------------------------------------------------------------------ Swatches */

interface Swatch {
  name: string;
  value: string;
  /** Extra label/value lines under Contrast, HEX and HSL. */
  details?: [string, ReactNode][];
}

/** One colour as a filled card: its name on top, its values at the bottom in a legible ink. */
const SwatchCard = ({ name, value, details = [] }: Swatch) => {
  const ink =
    contrastRatio(white, value) >= contrastRatio(sharedColors.colorText, value)
      ? white
      : sharedColors.colorText;
  const lines: [string, ReactNode][] = [
    ['Contrast on white', `${contrastRatio(value, white).toFixed(2)}:1`],
    ['HEX', toHex(value)],
    ['HSL', toHsl(value)],
    ...details,
  ];
  return (
    <div
      className="flex min-h-50 flex-col justify-between gap-6 rounded-md p-3 ring-1 ring-border-secondary ring-inset"
      style={{ background: value, color: ink }}
    >
      <div className="text-sm font-semibold wrap-anywhere">{name}</div>
      <div className="text-xs">
        {lines.map(([label, content]) => (
          <div key={label} className="flex justify-between gap-2">
            <span className="whitespace-nowrap opacity-65">{label}</span>
            <span className="text-right wrap-anywhere">{content}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const SwatchGroup = ({ title, swatches }: { title?: ReactNode; swatches: Swatch[] }) => (
  <div className="mb-8">
    {title && <div className="mt-2 mb-4 text-xl font-semibold">{title}</div>}
    {/* Arbitrary value: no utility fills a row with as many 170px-minimum cards as fit. */}
    <div className="grid grid-cols-[repeat(auto-fill,minmax(170px,1fr))] gap-2">
      {swatches.map((swatch) => (
        <SwatchCard key={swatch.name} {...swatch} />
      ))}
    </div>
  </div>
);

/* ------------------------------------------------------------------ Brand Palette */

/** Where a Brand Palette tint is reused as a Role Token. */
const brandRoles: Record<string, string> = {
  'cool-gray-tint-4': 'colorPrimaryBgHover',
  'cool-gray-tint-5': 'colorPrimaryBg',
};

const BrandRow = ({ id, color }: { id: string; color: BrandColor }) => {
  const steps: [string, string][] = [
    [kebab(id), color.base],
    ...color.tints.map((tint, index): [string, string] => [`${kebab(id)}-tint-${index + 1}`, tint]),
  ];
  return (
    <SwatchGroup
      title={
        <>
          {color.name} <span className="font-normal">({color.group})</span>
        </>
      }
      swatches={steps.map(([name, value], index) => ({
        name,
        value,
        details: [
          ...(index > 0 ? [['Use', 'decorative only'] as [string, string]] : []),
          ...(brandRoles[name] ? [['Token', brandRoles[name]] as [string, string]] : []),
        ],
      }))}
    />
  );
};

export const BrandPalette = () => (
  <Block>
    {(Object.keys(brandPalette) as (keyof typeof brandPalette)[]).map((id) => (
      <BrandRow key={id} id={id} color={brandPalette[id]} />
    ))}
  </Block>
);

/* ------------------------------------------------------------------ Role Tokens */

const roleGroups: { title: string; names: SharedColorName[] }[] = [
  {
    title: 'Text',
    names: [
      'colorText',
      'colorTextSecondary',
      'colorTextTertiary',
      'colorTextQuaternary',
      'colorTextDisabled',
      'colorTextPlaceholder',
    ],
  },
  { title: 'Borders', names: ['colorBorder', 'colorBorderSecondary'] },
  {
    title: 'Surfaces',
    names: [
      'colorBgContainer',
      'colorBgLayout',
      'colorBgElevated',
      'colorBgMask',
      'colorPrimaryBg',
      'colorPrimaryBgHover',
    ],
  },
];

/** The shared neutral Role Tokens. Status and Theme tokens are in their own blocks. */
export const RoleTokens = () => (
  <Block>
    {roleGroups.map(({ title, names }) => (
      <SwatchGroup
        key={title}
        title={title}
        swatches={names.map((name) => ({
          name,
          value: sharedColors[name],
          details: [['Tailwind', `--color-${tailwindName(name)}`]],
        }))}
      />
    ))}
  </Block>
);

export const NeutralPairings = () => {
  const pairings: Pairing[] = [];
  (['colorText', 'colorTextSecondary', 'colorTextTertiary'] as const).forEach((text) => {
    (['colorBgContainer', 'colorBgLayout'] as const).forEach((surface) => {
      pairings.push({
        label: (
          <>
            <Code>{text}</Code> on <Code>{surface}</Code>
          </>
        ),
        fg: sharedColors[text],
        bg: sharedColors[surface],
        minimum: 4.5,
      });
    });
  });
  return (
    <Block>
      <PairingTable pairings={pairings} />
    </Block>
  );
};

/* ------------------------------------------------------------------ Variants */

const variantSuffixes = ['', 'Hover', 'Active', 'Bg', 'Border'] as const;
const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1);

const VariantStrip = ({ title, entries }: { title?: ReactNode; entries: [string, string][] }) => (
  <SwatchGroup
    title={title}
    swatches={entries.map(([name, value]) => ({
      name,
      value,
      details: [['Tailwind', tailwindName(name)]],
    }))}
  />
);

const statusToken = (status: Status, suffix: string) =>
  `color${capitalize(status)}${suffix}` as SharedColorName;

/** The shades of each status: base, hover, active, background and border. */
export const StatusVariants = () => (
  <Block>
    {statuses.map((status) => (
      <VariantStrip
        key={status}
        title={capitalize(status)}
        entries={variantSuffixes.map((suffix): [string, string] => [
          statusToken(status, suffix),
          sharedColors[statusToken(status, suffix)],
        ])}
      />
    ))}
    <p>
      <NotDefined /> Status colours are antd's defaults, except the error active and background
      shades, which were changed for accessibility.
    </p>
  </Block>
);

export const StatusPairings = () => {
  const pairings: Pairing[] = [];
  statuses.forEach((status) => {
    const base = sharedColors[statusToken(status, '')];
    const active = sharedColors[statusToken(status, 'Active')];
    const bg = sharedColors[statusToken(status, 'Bg')];
    pairings.push(
      {
        label: (
          <>
            <Code>{statusToken(status, '')}</Code> on white (icon, border)
          </>
        ),
        fg: base,
        bg: white,
        minimum: 3,
      },
      {
        label: (
          <>
            <Code>{statusToken(status, 'Active')}</Code> on <Code>{statusToken(status, 'Bg')}</Code>{' '}
            (text)
          </>
        ),
        fg: active,
        bg,
        minimum: 4.5,
      },
    );
  });
  return (
    <Block>
      <PairingTable pairings={pairings} />
    </Block>
  );
};

/* ------------------------------------------------------------------ Themes */

const themeKeys: (keyof Theme)[] = [
  'colorPrimary',
  'colorPrimaryHover',
  'colorPrimaryActive',
  'colorPrimaryBorder',
  'colorPrimaryBorderHover',
  'colorLink',
  'colorLinkHover',
  'colorLinkActive',
];

const headerMessages: Record<string, string> = {
  'header.skipLinks.main': 'Skip to main content',
  'header.skipLinks.footer': 'Skip to footer',
  'header.home': 'PCGL home',
  'header.nav': 'Main',
  'header.menu.open': 'Open menu',
  'header.menu.close': 'Close menu',
};

const footerMessages: Record<string, string> = {
  'footer.meta.fundingTitle': 'Acknowledgement of funding',
  'footer.meta.logoText': 'Pan-Canadian Genome Library logo',
  'footer.meta.cihrLogoText': 'Canadian Institutes of Health Research logo',
  'footer.meta.cihrSupport':
    'PCGL is supported by the Canadian Institutes of Health Research (CIHR).',
  'footer.section.about': 'About PCGL',
  'footer.label.pcglWebsite': 'PCGL Website',
  'footer.href.pcglWebsite': 'https://genomelibrary.ca',
};

const footerItems = [{ title: 'about', items: [{ label: 'pcglWebsite', href: 'pcglWebsite' }] }];

const translate = (messages: Record<string, string>) => (key: string) => messages[key] ?? key;

/** One Theme: its values, and the header and footer drawn in its primary colour via `brand`. */
export const ThemePreview = ({ name }: { name: ThemeName }) => {
  const theme = themes[name];
  return (
    <Block>
      <VariantStrip entries={themeKeys.map((key): [string, string] => [key, theme[key]])} />
      <p className="my-4">
        <Code>colorPrimary</Code> and <Code>colorLink</Code> come from the Brand Guidelines. The
        other shades come from antd's colour algorithm <NotDefined />
      </p>
      <PairingTable
        pairings={[
          { label: 'Primary on white', fg: theme.colorPrimary, bg: white, minimum: 4.5 },
          { label: 'White on primary', fg: white, bg: theme.colorPrimary, minimum: 4.5 },
          {
            label: (
              <>
                Primary on <Code>colorPrimaryBg</Code>
              </>
            ),
            fg: theme.colorPrimary,
            bg: sharedColors.colorPrimaryBg,
            minimum: 4.5,
          },
          {
            label: (
              <>
                Primary on <Code>colorPrimaryBgHover</Code>
              </>
            ),
            fg: theme.colorPrimary,
            bg: sharedColors.colorPrimaryBgHover,
            minimum: 4.5,
          },
        ]}
      />
      <div className="overflow-hidden rounded-lg border border-border">
        <Header
          brand={theme.colorPrimary}
          translator={translate(headerMessages)}
          logo={<span className="text-2xl font-semibold">PCGL {theme.name}</span>}
          nav={
            <>
              <HeaderNavLink href="#guidelines" current>
                Guidelines
              </HeaderNavLink>
              <HeaderNavLink href="#help">Help Guides</HeaderNavLink>
            </>
          }
          account={
            <HeaderButton variant="primary" href="#login">
              Login
            </HeaderButton>
          }
        />
        <FooterContainer
          brand={theme.colorPrimary}
          translator={translate(footerMessages)}
          footerItems={footerItems}
        />
      </div>
    </Block>
  );
};

/* ------------------------------------------------------------------ Focus ring */

interface Surface {
  label: ReactNode;
  color: (theme: Theme) => string;
}

const surfaces: Surface[] = [
  { label: <Code>colorBgContainer</Code>, color: () => sharedColors.colorBgContainer },
  { label: <Code>colorBgLayout</Code>, color: () => sharedColors.colorBgLayout },
  { label: <Code>colorPrimaryBg</Code>, color: () => sharedColors.colorPrimaryBg },
  { label: <Code>colorPrimaryBgHover</Code>, color: () => sharedColors.colorPrimaryBgHover },
  ...statuses.map((status): Surface => ({
    label: <Code>{statusToken(status, 'Bg')}</Code>,
    color: () => sharedColors[statusToken(status, 'Bg')],
  })),
  { label: <Code>colorPrimary</Code>, color: (theme) => theme.colorPrimary },
  { label: <Code>colorPrimaryActive</Code>, color: (theme) => theme.colorPrimaryActive },
  { label: 'Black (Brand Palette)', color: () => brandPalette.black.base },
];

const FocusSample = ({ surface, ring }: { surface: string; ring: string }) => (
  <span className="inline-block rounded-md p-2" style={{ background: surface }}>
    <span
      className="inline-block h-4 w-8 rounded-sm bg-border"
      style={{ outline: `${focusRing.width}px solid ${ring}`, outlineOffset: focusRing.offset }}
    />
  </span>
);

/**
 * Which focus-ring colour to use on each surface: the Theme's primary where it reaches 3:1,
 * otherwise white. Black is not a step.
 */
export const FocusRingSurfaces = () => (
  <Block>
    <Table head={['Surface', ...themeNames.map((name) => `${themes[name].name} Theme`)]}>
      {surfaces.map((surface, index) => (
        <Row key={index}>
          <Cell>{surface.label}</Cell>
          {themeNames.map((name) => {
            const theme = themes[name];
            const bg = surface.color(theme);
            const primaryRatio = contrastRatio(theme.colorPrimary, bg);
            const usePrimary = primaryRatio >= 3;
            const ring = usePrimary ? theme.colorPrimary : focusRing.contrastColor;
            const ratio = usePrimary ? primaryRatio : contrastRatio(focusRing.contrastColor, bg);
            return (
              <Cell key={name}>
                <span className="inline-flex items-center gap-3">
                  <FocusSample surface={bg} ring={ring} />
                  <span>
                    {usePrimary ? 'Primary' : 'White'} ({ratio.toFixed(2)}:1)
                    {ratio < 3 && <strong> neither reaches 3:1</strong>}
                  </span>
                </span>
              </Cell>
            );
          })}
        </Row>
      ))}
    </Table>
  </Block>
);

/* ------------------------------------------------------------------ Errata */

/** [PDF page, colour, PDF hex, PDF RGB, note, the Token Source value]. */
const errata: [string, string, string, string, string, string][] = [
  [
    '11',
    'Dusty Rose (base)',
    '#DFC7C5',
    '223, 191, 197 (#DFBFC5)',
    'Green channel differs',
    brandPalette.dustyRose.base,
  ],
  [
    '12',
    'Cool Gray (tonal chart base)',
    '#929497',
    '236, 28, 36',
    "RGB is Red's",
    brandPalette.coolGray.base,
  ],
  [
    '12',
    'Deep Blue tint 1',
    '#155680',
    '21, 85, 128',
    'Off by one',
    brandPalette.deepBlue.tints[0],
  ],
  [
    '12',
    'Deep Blue tint 2',
    '#1F6592',
    '31, 102, 146',
    'Off by one',
    brandPalette.deepBlue.tints[1],
  ],
  [
    '12',
    'Red tint 3',
    '#F16B71',
    '199, 203, 209 (#C7CBD1)',
    "RGB is Cool Gray tint 3's",
    brandPalette.red.tints[2],
  ],
  [
    '13',
    'Dusty Rose tint 1',
    '##E3CCCA',
    '227, 204, 202',
    'Double #; RGB matches',
    brandPalette.dustyRose.tints[0],
  ],
  [
    '13',
    'Light Sea Green tint 2',
    '#41E0C2',
    '65, 224, 195',
    'Off by one',
    brandPalette.lightSeaGreen.tints[1],
  ],
];

/** Places where the Brand Guidelines PDF (v2.0) contradicts itself. The hex value wins. */
export const Errata = () => (
  <Block>
    <Table head={['PDF page', 'Colour', 'PDF hex', 'PDF RGB', 'Note', 'Value used']}>
      {errata.map(([page, colour, hex, rgb, note, used]) => (
        <Row key={colour}>
          <Cell>{page}</Cell>
          <Cell>{colour}</Cell>
          <Cell>{hex}</Cell>
          <Cell>{rgb}</Cell>
          <Cell>{note}</Cell>
          <Cell>
            <Code>{used}</Code>
          </Cell>
        </Row>
      ))}
    </Table>
  </Block>
);

/** The transparent text Role Tokens, grouped by value; each group shares one rgba. */
const transparentText: SharedColorName[][] = [
  ['colorTextSecondary'],
  ['colorTextTertiary'],
  ['colorTextQuaternary', 'colorTextDisabled', 'colorTextPlaceholder'],
];

/** Each transparent text token as rgba, as hex with an alpha channel, and as the solid hex it renders as on white. */
export const TransparentTextOnWhite = () => (
  <ColorPalette>
    {transparentText.map((names) => {
      const rgba = sharedColors[names[0] as SharedColorName];
      const hexAlpha = toHex(rgba);
      const hex = toHexOnWhite(rgba);
      return (
        <ColorItem
          key={rgba}
          title={names.join(', ')}
          subtitle={`${rgba} = ${hexAlpha}; ${hex} on white`}
          colors={{ rgba, 'hex with alpha': hexAlpha, 'hex on white': hex }}
        />
      );
    })}
  </ColorPalette>
);
