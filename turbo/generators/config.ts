import type { PlopTypes } from "@turbo/gen";

export default function generator(plop: PlopTypes.NodePlopAPI): void {
  plop.setGenerator("shared-component", {
    description: "Generates a UI component, test suite, and a Storybook file across workspaces",
    prompts: [
      {
        type: "input",
        name: "name",
        message: "What is the name of the component? (e.g., button, user card)",
        validate: (input: string) => {
          if (input.trim() === "") return "Component name is required";
          return true;
        },
      },
    ],
    actions: [
      {
        type: "add",
        path: "{{turbo.paths.root}}/packages/ui/src/{{pascalCase name}}/{{pascalCase name}}.tsx",
        templateFile: "templates/ui-component-generator.hbs",
      },
      {
        type: "add",
        path: "{{turbo.paths.root}}/packages/ui/src/{{pascalCase name}}/tests/{{pascalCase name}}.test.tsx",
        templateFile: "templates/ui-test-generator.hbs",
      },
      {
        type: "add",
        path: "{{turbo.paths.root}}/apps/docs/src/stories/{{pascalCase name}}.stories.tsx",
        templateFile: "templates/ui-storybook-generator.hbs",
      },
    ],
  });
}
