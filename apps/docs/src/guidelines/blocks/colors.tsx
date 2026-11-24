import type { ReactNode } from 'react';
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
import {
  Block,
  Cell,
  Chip,
  Code,
  NotDefined,
  PairingTable,
  Ratio,
  Row,
  Table,
  type Pairing,
} from './ui';

const white = sharedColors.colorBgContainer;
const themeNames = Object.keys(themes) as ThemeName[];

/** `colorPrimaryBgHover` -> `primary-bg-hover`: the Tailwind colour name of an antd Role Token. */
const tailwindName = (antdName: string): string =>
  antdName
    .replace(/^color/, '')
    .replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    .slice(1);

const kebab = (name: string): string => name.replace(/[A-Z]/g, (l) => `-${l.toLowerCase()}`);

/** Shared values the system changed from antd's default, and why (ADR 0005's exceptions). */
const accessibilityChanges: Partial<Record<SharedColorName, string>> = {
  colorPrimaryBg:
    "Cool Gray tint 5 from the Brand Guidelines. antd's computed shade leaves primary text below 4.5:1.",
  colorPrimaryBgHover:
    "Cool Gray tint 4 from the Brand Guidelines. antd's computed shade leaves primary text below 4.5:1.",
  colorTextTertiary: "0.55, not antd's 0.45, which gives 3.35:1 on white.",
  colorErrorActive: "Not antd's #d9363e, which gives 4.22:1 on the error background.",
  colorErrorBg: "Not antd's #fff2f0; paired with the error active shade above.",
};

const sharedOrigin = (name: SharedColorName): ReactNode =>
  accessibilityChanges[name] ? (
    <>
      <NotDefined>Changed for accessibility</NotDefined>{' '}
      <span style={{ fontSize: 12 }}>{accessibilityChanges[name]}</span>
    </>
  ) : (
    <NotDefined />
  );

/* ------------------------------------------------------------------ Brand Palette */

const BrandRow = ({ id, color }: { id: string; color: BrandColor }) => {
  const steps: [string, string][] = [
    [kebab(id), color.base],
    ...color.tints.map((tint, index): [string, string] => [`${kebab(id)}-tint-${index + 1}`, tint]),
  ];
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontWeight: 600, marginBottom: 8 }}>
        {color.name} <span style={{ fontWeight: 400 }}>({color.group})</span>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 12,
        }}
      >
        {steps.map(([name, value], index) => (
          <div key={name}>
            <div
              style={{
                height: 56,
                borderRadius: 6,
                background: value,
                boxShadow: `inset 0 0 0 1px ${sharedColors.colorBorderSecondary}`,
              }}
            />
            <div style={{ fontSize: 12, lineHeight: '20px', marginTop: 4 }}>
              <div>
                <Code>{name}</Code>
              </div>
              <div>{value}</div>
              <div>
                on white <Ratio fg={value} bg={white} />
              </div>
              {index > 0 && (
                <div style={{ color: sharedColors.colorTextSecondary }}>decorative only</div>
              )}
              {id === 'coolGray' && index === 5 && <div>= colorPrimaryBg</div>}
              {id === 'coolGray' && index === 4 && <div>= colorPrimaryBgHover</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
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

const RoleRow = ({ name }: { name: SharedColorName }) => {
  const value = sharedColors[name];
  return (
    <Row>
      <Cell>
        <Chip color={value} size={28} />
      </Cell>
      <Cell>
        <Code>{name}</Code>
      </Cell>
      <Cell>
        <Code>--color-{tailwindName(name)}</Code>
      </Cell>
      <Cell>{value}</Cell>
      <Cell>
        <Ratio fg={value} bg={white} />
      </Cell>
      <Cell>{sharedOrigin(name)}</Cell>
    </Row>
  );
};

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
      <div key={title}>
        <div style={{ fontWeight: 600, marginTop: 16 }}>{title}</div>
        <Table
          head={[
            'Sample',
            'antd token',
            'Tailwind variable',
            'Value',
            'Contrast on white',
            'Source',
          ]}
        >
          {names.map((name) => (
            <RoleRow key={name} name={name} />
          ))}
        </Table>
      </div>
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

const VariantStrip = ({ entries }: { entries: [string, string][] }) => (
  <div
    style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: 12,
    }}
  >
    {entries.map(([name, value]) => (
      <div key={name}>
        <div
          style={{
            height: 48,
            borderRadius: 6,
            background: value,
            boxShadow: `inset 0 0 0 1px ${sharedColors.colorBorderSecondary}`,
          }}
        />
        <div style={{ fontSize: 12, lineHeight: '20px', marginTop: 4 }}>
          <div>
            <Code>{name}</Code>
          </div>
          <div>
            <Code>{tailwindName(name)}</Code>
          </div>
          <div>{value}</div>
          <div>
            on white <Ratio fg={value} bg={white} />
          </div>
        </div>
      </div>
    ))}
  </div>
);

const statusToken = (status: Status, suffix: string) =>
  `color${capitalize(status)}${suffix}` as SharedColorName;

/** The shades of each status: base, hover, active, background and border. */
export const StatusVariants = () => (
  <Block>
    {statuses.map((status) => (
      <div key={status} style={{ marginBottom: 24 }}>
        <div style={{ fontWeight: 600, marginBottom: 8 }}>{capitalize(status)}</div>
        <VariantStrip
          entries={variantSuffixes.map((suffix): [string, string] => [
            statusToken(status, suffix),
            sharedColors[statusToken(status, suffix)],
          ])}
        />
      </div>
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
      <p style={{ margin: '16px 0' }}>
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
      <div
        style={{
          border: `1px solid ${sharedColors.colorBorder}`,
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <Header
          brand={theme.colorPrimary}
          translator={translate(headerMessages)}
          logo={<span style={{ fontSize: 24, fontWeight: 600 }}>PCGL {theme.name}</span>}
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
  <span style={{ display: 'inline-block', background: surface, padding: 8, borderRadius: 6 }}>
    <span
      style={{
        display: 'inline-block',
        width: 32,
        height: 16,
        borderRadius: 4,
        background: sharedColors.colorBorder,
        outline: `${focusRing.width}px solid ${ring}`,
        outlineOffset: focusRing.offset,
      }}
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
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
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
