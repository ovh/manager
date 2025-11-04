type ParameterDocSourceConfig = {
  format: string,
  transform: (code: string) => string,
  type: string,
}

function extractStoryRenderSourceCode(code: string): string {
  const matches = [...code.matchAll(/render: \({[\w\s,]*}\) => {?([.\s\S]*)}?\n}$/gm)];

  if (matches.length && matches[0].length >= 2) {
    return matches[0][1];
  }

  return code;
}

/**
 * Storybook does not always render React code correctly (see https://github.com/storybookjs/storybook/issues/23366)
 * For example, when:
 *  - you define actual code as the render function (ie not only JSX)
 *  - you use arrow function in a component prop
 *  - you use { false } as an attribute value
 *
 *  To avoid having to duplicate the source in a code attribute, we try to extract the render string during the transform step.
 *
 *  /!\ This rely on a specific story setup /!\
 *   - render has to be the last prop of your Story config
 *   - render has to be an arrow function
 *
 *  Hopefully better source generation will be available as we get new versions.
 */
function staticSourceRenderConfig(): ParameterDocSourceConfig {
  return {
    format: 'dedent',
    transform: extractStoryRenderSourceCode,
    type: 'code',
  };
}

export {
  extractStoryRenderSourceCode,
  staticSourceRenderConfig,
};
