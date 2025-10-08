/**
 * Generate content for props file.
 * @param {string} compName - PascalCase component name.
 * @param {boolean} hasChildren - Whether the component supports children.
 * @returns {string}
 */
export function buildPropsTemplate(compName, hasChildren = false) {
  const importBase = `import { ${compName}Prop as Ods${compName}Props } from '@ovhcloud/ods-react';`;

  if (hasChildren) {
    return `${importBase}
import { PropsWithChildren } from 'react';

export type ${compName}Props = PropsWithChildren<Ods${compName}Props> & {};
`;
  }

  return `${importBase}

export type ${compName}Props = Ods${compName}Props & {};
`;
}

/**
 * Generate content for component file.
 * @param {string} compName - PascalCase component name.
 * @param {boolean} hasChildren - Whether the component supports children.
 * @returns {string}
 */
export function buildComponentTemplate(compName, hasChildren = false) {
  const importLine = `import { ${compName} as Ods${compName} } from '@ovhcloud/ods-react';
import { ${compName}Props } from './${compName}.props';`;

  if (hasChildren) {
    return `${importLine}

export const ${compName} = ({ children, ...others }: ${compName}Props) => (
  <Ods${compName} {...others}>{children}</Ods${compName}>
);
`;
  }

  return `${importLine}

export const ${compName} = (props: ${compName}Props) => <Ods${compName} {...props} />;
`;
}

/**
 * Generate index.ts template.
 * @param {string} compName - PascalCase component name.
 * @returns {string}
 */
export function buildIndexTemplate(compName) {
  return `export { ${compName} } from './${compName}.component';
export type { ${compName}Props } from './${compName}.props';
`;
}

/**
 * Generate snapshot test template.
 * @param {string} compName - PascalCase component name.
 * @param {boolean} hasChildren - Whether the component supports children.
 * @returns {string}
 */
export function buildSnapshotTestTemplate(compName, hasChildren = false) {
  if (hasChildren) {
    return `import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ${compName}, ${compName}Props } from '..';

describe('${compName} Snapshot tests', () => {
  it('renders the component with default props and children', () => {
    const { container } = render(<${compName}>Hello</${compName}>);
    expect(container).toMatchSnapshot();
  });
});
`;
  }

  return `import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ${compName}, ${compName}Props } from '..';

describe('${compName} Snapshot tests', () => {
  it('renders the component with default props', () => {
    const { container } = render(<${compName} />);
    expect(container).toMatchSnapshot();
  });
});
`;
}

/**
 * Generate the base template for components index.ts
 * Used when no index.ts exists yet in manager-react-components/src/components/
 *
 * @returns {string}
 */
export function buildComponentsIndexTemplate() {
  return `/**
 * Auto-generated Manager React Components index.
 * This file aggregates all component exports from ./src/components/
 * Do not edit manually — managed by MUK CLI.
 */

`;
}

/**
 * Generate spec test template for subcomponents.
 * @param {string} compName - PascalCase subcomponent name.
 * @returns {string}
 */
export function buildSubcomponentSpecTemplate(compName) {
  return `import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ${compName} } from '../${compName}.component';

describe('${compName}', () => {
  it('renders without crashing', () => {
    const { container } = render(<${compName} />);
    expect(container).toBeTruthy();
  });
});
`;
}

/**
 * Generate subcomponent implementation that reuses parent props.
 * @param {string} compName - PascalCase subcomponent name.
 * @param {string} parentName - PascalCase parent component name.
 * @returns {string}
 */
export function buildSubcomponentTemplate(compName, parentName) {
  return `import { PropsWithChildren } from 'react';
import { ${parentName}Props } from '../${parentName}.props';

export const ${compName} = ({ children }: PropsWithChildren<${parentName}Props>) => <>{children}</>;
`;
}

/**
 * Generate index template for subcomponents (future-proof for nested children).
 * @param {string} compName - PascalCase subcomponent name.
 * @returns {string}
 */
export function buildSubcomponentIndexTemplate(compName) {
  return `export { ${compName} } from './${compName}.component';
`;
}

/**
 * Extend getComponentTemplates with subcomponent templates
 */
export function getComponentTemplates(compName, hasChildren = false) {
  return {
    props: buildPropsTemplate(compName, hasChildren),
    component: buildComponentTemplate(compName, hasChildren),
    index: buildIndexTemplate(compName),
    test: buildSnapshotTestTemplate(compName, hasChildren),
    subSpec: buildSubcomponentSpecTemplate(compName),
    subIndex: buildSubcomponentIndexTemplate(compName),
  };
}
