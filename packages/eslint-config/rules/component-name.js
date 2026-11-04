const PASCAL_CASE = /^[A-Z][A-Za-z0-9]*$/;

/**
 * Requires top-level functions that render JSX to be named in PascalCase.
 *
 * @type {import("eslint").Rule.RuleModule}
 * */
export const componentName = {
  meta: {
    type: 'suggestion',
    docs: { description: 'Require React component names to be PascalCase' },
    schema: [],
    messages: {
      notPascalCase: "Component '{{name}}' must be named in PascalCase.",
    },
  },
  create(context) {
    const stack = [];

    const isTopLevel = (node) =>
      node.type === 'Program' ||
      node.type === 'ExportNamedDeclaration' ||
      node.type === 'ExportDefaultDeclaration';

    const getComponentId = (fn) => {
      if (fn.type === 'FunctionDeclaration') {
        return isTopLevel(fn.parent) ? fn.id : null;
      }
      const declarator = fn.parent;
      if (declarator?.type !== 'VariableDeclarator' || declarator.id.type !== 'Identifier') {
        return null;
      }
      return isTopLevel(declarator.parent.parent) ? declarator.id : null;
    };

    const enter = () => stack.push(false);
    const exit = (fn) => {
      const rendersJsx = stack.pop();
      const id = rendersJsx && getComponentId(fn);
      if (id && !PASCAL_CASE.test(id.name)) {
        context.report({ node: id, messageId: 'notPascalCase', data: { name: id.name } });
      }
    };
    const markJsx = () => stack.fill(true);

    return {
      FunctionDeclaration: enter,
      FunctionExpression: enter,
      ArrowFunctionExpression: enter,
      'FunctionDeclaration:exit': exit,
      'FunctionExpression:exit': exit,
      'ArrowFunctionExpression:exit': exit,
      JSXElement: markJsx,
      JSXFragment: markJsx,
    };
  },
};
