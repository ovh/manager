/**
 * Generate content for props file.
 * @param {string} componentName - PascalCase component name.
 * @param {boolean} hasChildren - Whether the component supports children.
 * @returns {string}
 */
export function buildPropsTemplate(componentName, hasChildren = false) {
  const importBase = `import { ${componentName}Prop as Ods${componentName}Props } from '@ovhcloud/ods-react';`;

  if (hasChildren) {
    return `${importBase}
import { PropsWithChildren } from 'react';

export type ${componentName}Props = PropsWithChildren<Ods${componentName}Props> & {};
`;
  }

  return `${importBase}

export type ${componentName}Props = Ods${componentName}Props & {};
`;
}

/**
 * Generate content for component file.
 * @param {string} componentName - PascalCase component name.
 * @param {boolean} hasChildren - Whether the component supports children.
 * @returns {string}
 */
export function buildComponentTemplate(componentName, hasChildren = false) {
  const importLine = `import { ${componentName} as Ods${componentName} } from '@ovhcloud/ods-react';
import { ${componentName}Props } from './${componentName}.props';`;

  if (hasChildren) {
    return `${importLine}

export const ${componentName} = ({ children, ...others }: ${componentName}Props) => (
  <Ods${componentName} {...others}>{children}</Ods${componentName}>
);
`;
  }

  return `${importLine}

export const ${componentName} = (props: ${componentName}Props) => <Ods${componentName} {...props} />;
`;
}

/**
 * Generate index.ts template.
 * @param {string} componentName - PascalCase component name.
 * @returns {string}
 */
export function buildIndexTemplate(componentName) {
  return `export { ${componentName} } from './${componentName}.component';
export type { ${componentName}Props } from './${componentName}.props';
`;
}

/**
 * Generate snapshot test template.
 * @param {string} componentName - PascalCase component name.
 * @param {boolean} hasChildren - Whether the component supports children.
 * @returns {string}
 */
export function buildSnapshotTestTemplate(componentName, hasChildren = false) {
  if (hasChildren) {
    return `import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ${componentName}, ${componentName}Props } from '..';

describe('${componentName} Snapshot tests', () => {
  it('renders the component with default props and children', () => {
    const { container } = render(<${componentName}>Hello</${componentName}>);
    expect(container).toMatchSnapshot();
  });
});
`;
  }

  return `import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ${componentName}, ${componentName}Props } from '..';

describe('${componentName} Snapshot tests', () => {
  it('renders the component with default props', () => {
    const { container } = render(<${componentName} />);
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
 * @param {string} componentName - PascalCase subcomponent name.
 * @returns {string}
 */
export function buildSubcomponentSpecTemplate(componentName) {
  return `import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { ${componentName} } from '../${componentName}.component';

describe('${componentName}', () => {
  it('renders the component with default props', () => {
    const { container } = render(<${componentName} />);
    expect(container).toBeTruthy();
  });
});
`;
}

/**
 * Generate subcomponent props definition.
 *
 * @param {string} subName - PascalCase subcomponent name
 * @param {string} parentName - PascalCase parent component name
 * @param {boolean} hasOwnType - Whether the ODS package exports a dedicated prop type for this subcomponent
 * @param {boolean} hasChildren - Whether the subcomponent supports children
 * @returns {string}
 */
export function buildSubcomponentPropsTemplate(
  subName,
  parentName,
  hasOwnType = false,
  hasChildren = false,
) {
  if (hasOwnType) {
    const importBase = `import { ${subName}Prop as Ods${subName}Props } from '@ovhcloud/ods-react';`;

    if (hasChildren) {
      return `${importBase}
import { PropsWithChildren } from 'react';

export type ${subName}Props = PropsWithChildren<Ods${subName}Props> & {};
`;
    }

    return `${importBase}

export type ${subName}Props = Ods${subName}Props & {};
`;
  }

  // Fallback to parent props
  if (hasChildren) {
    return `import { PropsWithChildren } from 'react';
import { ${parentName}Props } from '../${parentName}.props';

export type ${subName}Props = PropsWithChildren<${parentName}Props> & {};
`;
  }

  return `import { ${parentName}Props } from '../${parentName}.props';

export type ${subName}Props = ${parentName}Props & {};
`;
}

/**
 * Generate subcomponent implementation.
 *
 * @param {string} componentName - PascalCase subcomponent name.
 * @param {boolean} hasChildren - Whether the subcomponent supports children.
 * @returns {string}
 */
export function buildSubcomponentTemplate(componentName, hasChildren = false) {
  const importBase = `import { ${componentName} as ODS${componentName} } from '@ovhcloud/ods-react';
import { ${componentName}Props } from './${componentName}.props';`;

  if (hasChildren) {
    return `${importBase}
import { PropsWithChildren } from 'react';

export const ${componentName} = ({ children, ...props }: PropsWithChildren<${componentName}Props>) => (
  <ODS${componentName} {...props}>{children}</ODS${componentName}>
);
`;
  }

  return `${importBase}

export const ${componentName} = (props: ${componentName}Props) => (
  <ODS${componentName} {...props} />
);
`;
}

/**
 * Generate index template for subcomponents (future-proof for nested children).
 * @param {string} componentName - PascalCase subcomponent name.
 * @returns {string}
 */
export function buildSubcomponentIndexTemplate(componentName) {
  return `export { ${componentName} } from './${componentName}.component';
`;
}

/**
 * Extend getComponentTemplates with subcomponent templates
 */
export function getComponentTemplates(componentName, hasChildren = false) {
  return {
    props: buildPropsTemplate(componentName, hasChildren),
    component: buildComponentTemplate(componentName, hasChildren),
    index: buildIndexTemplate(componentName),
    test: buildSnapshotTestTemplate(componentName, hasChildren),
    subSpec: buildSubcomponentSpecTemplate(componentName),
    subIndex: buildSubcomponentIndexTemplate(componentName),
  };
}
