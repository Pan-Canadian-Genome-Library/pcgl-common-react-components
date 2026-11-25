/** Setup snippets for the Guidelines pages, built from the Token Source so they can't drift. */
import { fontFamilies, fontWeights, themes, type ThemeName } from '@repo/ui/tokens';
import { antdThemes } from '@repo/ui/tokens/antd';

export const themeNames = Object.keys(themes) as ThemeName[];

/** The fonts a Portal loads: Jost for headings (600), Work Sans for body (400) and strong text (600). */
export const googleFontsLink = `<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  rel="stylesheet"
  href="https://fonts.googleapis.com/css2?family=Jost:wght@${fontWeights.strong}&family=Work+Sans:wght@${fontWeights.regular};${fontWeights.strong}&display=swap"
/>`;

/** antd has one `fontFamily` token, so antd Portals set the heading family with CSS. */
export const antdHeadingRule = `h1, h2, h3, h4, h5,
h1.ant-typography, h2.ant-typography, h3.ant-typography, h4.ant-typography, h5.ant-typography {
  font-family: ${fontFamilies.heading};
}`;

export const tailwindSetup = (theme: ThemeName) => `/* The Portal's main stylesheet */
@import 'tailwindcss';
@import '@repo/ui/tokens/${theme}.css';`;

export const tailwindNoThemeSetup = `@import 'tailwindcss';
@import '@repo/ui/tokens/theme.css';

@theme {
  --color-primary: #…;
  --color-primary-hover: #…;
  --color-primary-active: #…;
  --color-primary-border: #…;
  --color-primary-border-hover: #…;
  --color-link: #…;
  --color-link-hover: #…;
  --color-link-active: #…;
  --color-focus-ring: #…;
}`;

export const tailwindUsage = `<h1 class="heading-1">Studies</h1>
<p class="body-text">Request access to controlled data.</p>
<button class="bg-primary hover:bg-primary-hover text-white rounded-md px-4 py-1 shadow-sm">
  Apply
</button>
<div class="bg-error-bg border border-error-border text-text">Error: the file is missing.</div>`;

export const antdSetup = (theme: ThemeName) => `import { ConfigProvider } from 'antd';
import { ${theme}Theme } from '@repo/ui/tokens/antd';
import '@repo/ui/tokens/antd-focus-${theme}.css';

export const App = () => (
  <ConfigProvider theme={${theme}Theme}>
    {/* … */}
  </ConfigProvider>
);`;

export const brandPropUsage = `import { themes } from '@repo/ui/tokens';
import { Header } from '@repo/ui/header';
import { FooterContainer } from '@repo/ui/footer';

<Header brand={themes.research.colorPrimary} … />
<FooterContainer brand={themes.research.colorPrimary} … />`;

export const antdObject = (theme: ThemeName): string => JSON.stringify(antdThemes[theme], null, 2);
