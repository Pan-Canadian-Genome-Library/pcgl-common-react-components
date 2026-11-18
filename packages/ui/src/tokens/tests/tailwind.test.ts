import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import tailwindcss from '@tailwindcss/postcss';
import { describe, expect, it } from 'vitest';
import { sharedColors, themes } from '..';
import { tailwindTokenOutput } from '../tailwind';

const tokensDir = join(dirname(fileURLToPath(import.meta.url)), '..');

/** Compiles `css` as if it were a Portal stylesheet in `src/tokens/`, using only `candidates`. */
const compile = async (css: string, candidates: string[]): Promise<string> => {
  const from = join(tokensDir, '__portal__.css');
  const source = `${css}\n@source inline(${JSON.stringify(candidates.join(' '))});`;
  const result = await postcss([tailwindcss({ base: tokensDir })]).process(source, { from });
  return result.css;
};

/** The declarations of the rule whose selector is exactly `selector`. */
const rule = (css: string, selector: string): Record<string, string> => {
  const declarations: Record<string, string> = {};
  postcss.parse(css).walkRules((node) => {
    if (node.selector !== selector) return;
    node.walkDecls((decl) => {
      declarations[decl.prop] = decl.value;
    });
  });
  return declarations;
};

/** The `@media` condition that wraps (or is nested in) the rule whose selector is `selector`. */
const mediaQuery = (css: string, selector: string): string | undefined => {
  let params: string | undefined;
  postcss.parse(css).walkRules((node) => {
    if (node.selector !== selector) return;
    const parent = node.parent;
    if (parent?.type === 'atrule' && 'name' in parent && parent.name === 'media') {
      params = String(parent.params);
    }
    node.walkAtRules('media', (media) => {
      params = media.params;
    });
  });
  return params;
};

const variable = (css: string, name: string): string | undefined => {
  let value: string | undefined;
  postcss.parse(css).walkDecls(name, (decl) => {
    value = decl.value;
  });
  return value;
};

describe('Tailwind Token Output', () => {
  it.each(Object.entries(tailwindTokenOutput()))(
    'the committed %s matches the Token Source',
    async (file, css) => {
      await expect(css).toMatchFileSnapshot(join(tokensDir, file));
    },
  );

  it.each(Object.entries(themes))(
    '%s.css gives Tailwind utilities PCGL values',
    async (name, theme) => {
      const css = await compile(`@import 'tailwindcss' source(none);\n@import './${name}.css';`, [
        'bg-primary',
        'text-error',
        'md:flex',
        'text-sm',
        'shadow-md',
      ]);

      expect(rule(css, '.bg-primary')['background-color']).toBe('var(--color-primary)');
      expect(variable(css, '--color-primary')).toBe(theme.colorPrimary);
      expect(rule(css, '.text-error').color).toBe('var(--color-error)');
      expect(variable(css, '--color-error')).toBe(sharedColors.colorError);
      expect(mediaQuery(css, '.md\\:flex')).toBe('(width >= 48rem)');
      expect(variable(css, '--text-sm')).toBe('0.875rem');
      expect(variable(css, '--text-sm--line-height')).toBe('calc(22 / 14)');
      expect(rule(css, '.shadow-md')['--tw-shadow']).toBe(
        '0 6px 16px 0 var(--tw-shadow-color, rgba(0, 0, 0, 0.08)), 0 3px 6px -4px var(--tw-shadow-color, rgba(0, 0, 0, 0.12)), 0 9px 28px 8px var(--tw-shadow-color, rgba(0, 0, 0, 0.05))',
      );
    },
  );

  it('heading-1 sets the family, colour, weight, size and line height of its tokens', async () => {
    const css = await compile(`@import 'tailwindcss' source(none);\n@import './research.css';`, [
      'heading-1',
    ]);

    expect(rule(css, '.heading-1')).toEqual({
      'font-family': 'var(--font-heading)',
      color: 'var(--color-text)',
      'font-weight': '600',
      'font-size': '2.375rem',
      'line-height': 'calc(46 / 38)',
    });
    expect(variable(css, '--font-heading')).toMatch(/^Jost, /);
    expect(variable(css, '--color-text')).toBe(sharedColors.colorText);
  });

  it('text-style utilities work with variants', async () => {
    const css = await compile(`@import 'tailwindcss' source(none);\n@import './research.css';`, [
      'md:heading-2',
    ]);

    expect(mediaQuery(css, '.md\\:heading-2')).toBe('(width >= 48rem)');
  });

  it('keeps the status utilities the Banner uses', async () => {
    const statusUtilities = ['success', 'info', 'warning', 'error'].flatMap((status) => [
      `text-${status}`,
      `bg-${status}-bg`,
      `border-${status}-border`,
    ]);
    const css = await compile(
      `@import 'tailwindcss' source(none);\n@import './theme.css';`,
      statusUtilities,
    );

    expect(variable(css, '--color-success-bg')).toBe(sharedColors.colorSuccessBg);
    expect(variable(css, '--color-warning-border')).toBe(sharedColors.colorWarningBorder);
    for (const utility of statusUtilities) {
      expect(css).toContain(`.${utility} {`);
    }
  });

  it('carries the pcgl prefix in the library’s own stylesheets', async () => {
    const css = await compile(
      `@import 'tailwindcss/theme.css' prefix(pcgl);\n@import './theme.css';\n@import 'tailwindcss/utilities.css' source(none);`,
      ['pcgl:bg-error-bg', 'pcgl:heading-3'],
    );

    expect(variable(css, '--pcgl-color-error-bg')).toBe(sharedColors.colorErrorBg);
    expect(rule(css, '.pcgl\\:heading-3').color).toBe('var(--pcgl-color-text)');
  });
});
