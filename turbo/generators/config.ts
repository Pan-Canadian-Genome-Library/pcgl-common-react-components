import { execFileSync } from 'node:child_process';
import type { PlopTypes } from '@turbo/gen';

const UI_SRC = '{{turbo.paths.root}}/packages/ui/src';
const COMPONENT_DIR = `${UI_SRC}/{{kebabCase name}}`;
const STORY_FILE = '{{turbo.paths.root}}/apps/docs/src/stories/{{pascalCase name}}.stories.ts';

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator('shared-component', {
    description: 'Generates a UI component, test suite, and a Storybook file across workspaces',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'What is the name of the component? (e.g., button, user card)',
        validate: (input: string) => {
          if (input.trim() === '') return 'Component name is required';
          if (!/^[a-zA-Z][a-zA-Z0-9 -]*$/.test(input.trim())) {
            return 'Use letters, numbers, spaces or dashes, starting with a letter';
          }
          return true;
        },
      },
    ],
    actions: [
      {
        type: 'add',
        path: `${COMPONENT_DIR}/{{kebabCase name}}.tsx`,
        templateFile: 'templates/component.tsx.hbs',
      },
      {
        type: 'add',
        path: `${COMPONENT_DIR}/index.ts`,
        templateFile: 'templates/index.ts.hbs',
      },
      {
        type: 'add',
        path: `${COMPONENT_DIR}/tests/{{kebabCase name}}.test.tsx`,
        templateFile: 'templates/component.test.tsx.hbs',
      },
      {
        type: 'add',
        path: STORY_FILE,
        templateFile: 'templates/component.stories.ts.hbs',
      },
      {
        type: 'modify',
        path: `${UI_SRC}/index.ts`,
        pattern: /\s*$/,
        template: "\nexport * from './{{kebabCase name}}';\n",
      },
      (answers) => {
        const files = [COMPONENT_DIR, STORY_FILE, `${UI_SRC}/index.ts`].map((path) =>
          plop.renderString(path, answers),
        );
        execFileSync('pnpm', ['exec', 'prettier', '--write', ...files], { stdio: 'ignore' });
        return 'Formatted generated files with Prettier';
      },
    ],
  });
}
