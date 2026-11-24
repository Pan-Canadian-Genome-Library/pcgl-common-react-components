import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import { describe, expect, it } from 'vitest';
import { focusRing, fontFamilies, sharedColors, themes } from '..';
import { antdThemes, dacoTheme, researchTheme } from '../antd';
import { antdFocusOutput } from '../generators/antd-focus';

const cssDir = join(dirname(fileURLToPath(import.meta.url)), '../css');

describe('antd focus stylesheets', () => {
  it.each(Object.entries(antdFocusOutput()))(
    'the committed %s matches the Token Source',
    async (file, css) => {
      await expect(css).toMatchFileSnapshot(join(cssDir, file));
    },
  );

  it.each(Object.entries(themes))(
    'antd-focus-%s.css gives :focus-visible the Theme primary and the focus offset',
    (name, theme) => {
      const css = antdFocusOutput()[`antd-focus-${name}.css`] ?? '';
      const declarations: Record<string, string> = {};
      postcss.parse(css).walkRules(':focus-visible', (rule) => {
        rule.walkDecls((decl) => {
          declarations[decl.prop] = decl.value;
        });
      });

      expect(declarations).toEqual({
        'outline-color': theme.colorPrimary,
        'outline-offset': `${focusRing.offset}px`,
      });
    },
  );
});

describe('antd Token Output', () => {
  it('has one object per Theme', () => {
    expect(Object.keys(antdThemes).sort()).toEqual(Object.keys(themes).sort());
    expect(antdThemes.research).toBe(researchTheme);
    expect(antdThemes.daco).toBe(dacoTheme);
  });

  it.each(Object.entries(themes))('%s carries the Token Source values', (name, theme) => {
    const { token } = antdThemes[name as keyof typeof antdThemes];
    const themeColors = Object.fromEntries(
      Object.entries(theme).filter(([key]) => key.startsWith('color')),
    );

    expect(token).toEqual({
      ...themeColors,
      ...sharedColors,
      fontFamily: fontFamilies.body,
      lineWidthFocus: 2,
    });
  });

  it.each(Object.entries(antdThemes))('%s sets only antd tokens', (_name, theme) => {
    expect(Object.keys(theme)).toEqual(['token']);
    expect(theme.token).not.toHaveProperty('name');
  });
});
