import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{u as s}from"./index-z9zJUwTx.js";import{M as r}from"./index-qV4cBGzN.js";import"./index-Bnop-kX6.js";import"./iframe-Bru3zJiY.js";import"./index-4pTrEEYx.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";const i=""+new URL("mrc-adding-component-U5pje9G1.png",import.meta.url).href;function t(o){const e={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...s(),...o.components};return n.jsxs(n.Fragment,{children:[n.jsx(r,{title:"Manager UI Kit/Guidelines/New component ?"}),`
`,n.jsx(e.h1,{id:"how-to-add-a-new-component",children:"How to add a new component"}),`
`,n.jsx(e.p,{children:"This guide will walk you through the process of creating and integrating a new component into the Manager UI Kit library."}),`
`,n.jsx(e.p,{children:"Correcting, adding new features on an existing component."}),`
`,n.jsx(e.h2,{id:"-github-issues",children:"📋 Github issues"}),`
`,n.jsx(e.p,{children:"Before adding a new component, create a bug or add a new feature"}),`
`,n.jsxs(e.p,{children:["You have to go on the github issue page ",n.jsx(e.a,{href:"https://github.com/ovh/manager/issues",rel:"nofollow",children:"here"}),", then create a new issue :"]}),`
`,n.jsx("img",{src:i,alt:"Create mrc issues",width:"600"}),`
`,n.jsx(e.p,{children:"Please fill the form :"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"title"}),`
`,n.jsx(e.li,{children:"Component/Hook/utils/Other"}),`
`,n.jsx(e.li,{children:"description"}),`
`,n.jsx(e.li,{children:"When do you expect the component ?"}),`
`]}),`
`,n.jsx(e.p,{children:"Its a must have if you have a mock up give by the design"}),`
`,n.jsx(e.p,{children:"If you already have a Open PR, code sample or prototype, please share to us."}),`
`,n.jsx(e.h2,{id:"️-component-structure",children:"🏗️ Component Structure"}),`
`,n.jsx(e.p,{children:"A new component should follow this structure:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`src/
  components/
    your-component/
      __tests__
          your-component.test.tsx
          your-component.snapshot.test.tsx
          __snapshots__
      your-component.component.tsx
      your-component.constants.ts
      your-component.props.ts
      your-component.types.ts
      your-component.scss
      index.ts
`})}),`
`,n.jsx(e.p,{children:"A new hook should follow this structure:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`src/
  hooks/
    your-custom-hook/
      __tests__
           your-custom-hook.test.tsx
      your-custom-hook.tsx
      your-custom-hook.types.ts
      index.ts
`})}),`
`,n.jsx(e.h3,{id:"name-convention",children:"name convention:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Package should be ",n.jsx(e.code,{children:"kebab-case"})]}),`
`,n.jsxs(e.li,{children:["React component, hooks ",n.jsx(e.code,{children:"UpperCamelCase"})]}),`
`,n.jsxs(e.li,{children:["Test name, file name ",n.jsx(e.code,{children:"UpperCamelCase"})]}),`
`]}),`
`,n.jsx(e.p,{children:"Adding story to manager-wiki"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`packages/manager-wiki/stories/managager-react-components/
  components/
    your-component/
      overview.mdx
      changelog.mdx
      documentation.mdx
      your-component.stories.ts
`})}),`
`,n.jsx(e.h2,{id:"-implementation-steps",children:"📝 Implementation Steps"}),`
`,n.jsx(e.h3,{id:"1--create-component-files",children:"1. 🎯 Create Component Files"}),`
`,n.jsx(e.p,{children:"First, create the necessary files in the correct directory:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// your-component.component.tsx
import { Text } from '@ovh-ux/muk';
import { YourComponentProps } from './your-component.types';
import { useYourComponent } from './your-component.utils';

export const YourComponent = ({ prop1, prop2 }: YourComponentProps) => {
  const { result } = useYourComponent(prop1, prop2);
  
  return (
    <OdsText>
      {result}
    </OdsText>
  );
};
`})}),`
`,n.jsx(e.h3,{id:"2--define-types",children:"2. 📦 Define Types"}),`
`,n.jsxs(e.p,{children:["Create type definitions in ",n.jsx(e.code,{children:"your-component.types.ts"}),":"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`export interface YourComponentProps {
  prop1: string;
  prop2: number;
  optionalProp?: boolean;
}
`})}),`
`,n.jsx(e.h3,{id:"5--create-stories",children:"5. 📚 Create Stories"}),`
`,n.jsxs(e.p,{children:["Create Storybook stories in ",n.jsx(e.code,{children:"your-component.stories.tsx"}),":"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { Meta, StoryObj } from '@storybook/react';
import { YourComponent } from './your-component.component';

const meta: Meta<typeof YourComponent> = {
  title: 'Components/YourComponent',
  component: YourComponent,
  tags: ['autodocs'],
  argTypes: {
    prop1: { control: 'text' },
    prop2: { control: 'number' },
    optionalProp: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj<typeof YourComponent>;

export const Default: Story = {
  args: {
    prop1: 'Example',
    prop2: 42,
  },
};
`})}),`
`,n.jsx(e.h3,{id:"6--add-tests",children:"6. ✅ Add Tests"}),`
`,n.jsxs(e.p,{children:["Create unit tests in ",n.jsx(e.code,{children:"your-component.test.tsx"}),":"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { render, screen } from '@testing-library/react';
import { YourComponent } from './your-component.component';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent prop1="test" prop2={42} />);
    expect(screen.getByText('test - 42')).toBeInTheDocument();
  });
});
`})}),`
`,n.jsx(e.p,{children:"Create snaphot"}),`
`,n.jsxs(e.blockquote,{children:[`
`,n.jsx(e.p,{children:"Info : Components in MRC must have a minimum of 90% coverage. More to follow with respect to Accessibility, visual regression testings."}),`
`]}),`
`,n.jsx(e.h3,{id:"7--create-snapshot-tests",children:"7. 📸 Create Snapshot Tests"}),`
`,n.jsxs(e.p,{children:["Create snapshot tests in ",n.jsx(e.code,{children:"your-component.snapshot.test.tsx"}),":"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { render } from '@testing-library/react';
import { YourComponent } from './your-component.component';

describe('YourComponent Snapshot Tests', () => {
  it('should match snapshot with default props', () => {
    const { container } = render(<YourComponent prop1="default" prop2={0} />);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with all props', () => {
    const { container } = render(
      <YourComponent 
        prop1="test value" 
        prop2={42} 
        optionalProp={true} 
      />
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('should match snapshot with different prop combinations', () => {
    const { container: container1 } = render(
      <YourComponent prop1="value1" prop2={10} />
    );
    expect(container1.firstChild).toMatchSnapshot('with value1 and 10');

    const { container: container2 } = render(
      <YourComponent prop1="value2" prop2={20} optionalProp={false} />
    );
    expect(container2.firstChild).toMatchSnapshot('with value2, 20, and optionalProp false');
  });
});
`})}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Snapshot Testing Best Practices:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["📸 ",n.jsx(e.strong,{children:"Multiple scenarios"}),": Test different prop combinations to catch visual regressions"]}),`
`,n.jsxs(e.li,{children:["🏷️ ",n.jsx(e.strong,{children:"Descriptive names"}),": Use descriptive snapshot names to identify what each snapshot represents"]}),`
`,n.jsxs(e.li,{children:["🔄 ",n.jsx(e.strong,{children:"Regular updates"}),": Review and update snapshots when making intentional changes"]}),`
`,n.jsxs(e.li,{children:["🎯 ",n.jsx(e.strong,{children:"Focused testing"}),": Test the component's visual output, not implementation details"]}),`
`,n.jsxs(e.li,{children:["📁 ",n.jsx(e.strong,{children:"Organized structure"}),": Keep snapshot files in ",n.jsx(e.code,{children:"__tests__/_snapshots_/"})," directory"]}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"When to update snapshots:"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"After intentional UI changes"}),`
`,n.jsx(e.li,{children:"When fixing bugs that affect rendering"}),`
`,n.jsx(e.li,{children:"When adding new features that change the component's appearance"}),`
`]}),`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Running snapshot tests:"})}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`# Run all snapshot tests
npm test -- --testNamePattern="snapshot"

# Update snapshots after intentional changes
npm test -- --testNamePattern="snapshot" --updateSnapshot
`})}),`
`,n.jsxs(e.blockquote,{children:[`
`,n.jsxs(e.p,{children:["⚠️ ",n.jsx(e.strong,{children:"Important"}),": Always review snapshot diffs before accepting changes. Snapshots should reflect intentional UI updates, not accidental regressions."]}),`
`]}),`
`,n.jsx(e.h3,{id:"8-export-component",children:"8. Export Component"}),`
`,n.jsxs(e.p,{children:["Add exports in ",n.jsx(e.code,{children:"index.ts"}),":"]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`export { namedExport } from './your-component.component';
export type { nameExportType } from './your-component.types';
`})}),`
`,n.jsxs(e.blockquote,{children:[`
`,n.jsxs(e.p,{children:["❌ Do not export with ",n.jsx(e.code,{children:"*"}),", it can cause issues during the library build"]}),`
`]}),`
`,n.jsx(e.h3,{id:"8-storybook-update",children:"8. Storybook Update"}),`
`,n.jsx(e.p,{children:"Add a documentation for the component in Manager WIKI"}),`
`,n.jsx(e.h2,{id:"-best-practices",children:"🎨 Best Practices"}),`
`,n.jsx(e.h3,{id:"component-design",children:"Component Design"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"🎯 Keep components focused and single-responsibility"}),`
`,n.jsx(e.li,{children:"🔄 Use TypeScript for type safety"}),`
`,n.jsx(e.li,{children:"📱 Ensure responsive design"}),`
`,n.jsx(e.li,{children:"♿ Follow accessibility guidelines"}),`
`]}),`
`,n.jsx(e.h3,{id:"code-style",children:"Code Style"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"📝 Use consistent naming conventions"}),`
`,n.jsx(e.li,{children:"📚 Add JSDoc comments for documentation"}),`
`,n.jsx(e.li,{children:"🧪 Write comprehensive tests"}),`
`,n.jsx(e.li,{children:"🔍 Include error handling"}),`
`]}),`
`,n.jsx(e.h3,{id:"performance",children:"Performance"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"⚡ Optimize rendering performance"}),`
`,n.jsx(e.li,{children:"📦 Minimize bundle size"}),`
`,n.jsx(e.li,{children:"🔄 Use proper memoization"}),`
`,n.jsx(e.li,{children:"🎯 Implement lazy loading when appropriate"}),`
`]}),`
`,n.jsx(e.h2,{id:"-code-review-checklist",children:"🔍 Code Review Checklist"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"[ ] Component follows the established structure"}),`
`,n.jsx(e.li,{children:"[ ] All necessary files are created"}),`
`,n.jsx(e.li,{children:"[ ] TypeScript types are properly defined"}),`
`,n.jsx(e.li,{children:"[ ] Unit tests are implemented"}),`
`,n.jsx(e.li,{children:"[ ] Storybook stories are created"}),`
`,n.jsx(e.li,{children:"[ ] Documentation is complete"}),`
`,n.jsx(e.li,{children:"[ ] Accessibility requirements are met"}),`
`,n.jsx(e.li,{children:"[ ] Performance is optimized"}),`
`,n.jsx(e.li,{children:"[ ] Code style guidelines are followed"}),`
`]}),`
`,n.jsx(e.h2,{id:"-additional-resources",children:"📚 Additional Resources"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://reactjs.org/docs/getting-started.html",rel:"nofollow",children:"React Documentation"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://www.typescriptlang.org/docs/",rel:"nofollow",children:"TypeScript Documentation"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://storybook.js.org/docs/react/get-started/introduction",rel:"nofollow",children:"Storybook Documentation"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://testing-library.com/docs/",rel:"nofollow",children:"Testing Library Documentation"})}),`
`]}),`
`,n.jsx(e.h2,{id:"-next-steps",children:"🚀 Next Steps"}),`
`,n.jsx(e.p,{children:"After creating your component:"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsx(e.li,{children:"📝 Update the component documentation"}),`
`,n.jsx(e.li,{children:"🔄 Create a pull request"}),`
`,n.jsx(e.li,{children:"✅ Request code review"}),`
`,n.jsx(e.li,{children:"🎯 Address review comments"}),`
`,n.jsx(e.li,{children:"📦 Prepare for release"}),`
`]}),`
`,n.jsx(e.h2,{id:"️-common-pitfalls",children:"⚠️ Common Pitfalls"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"❌ Avoid prop drilling"}),`
`,n.jsx(e.li,{children:"❌ Don't forget error boundaries"}),`
`,n.jsx(e.li,{children:"❌ Avoid unnecessary re-renders"}),`
`,n.jsx(e.li,{children:"❌ Don't skip accessibility testing"}),`
`]}),`
`,n.jsx(e.h2,{id:"-version-control",children:"🔄 Version Control"}),`
`,n.jsx(e.p,{children:"When committing your changes:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`git checkout -b feat/MANAGER-#
git add .
git commit -m "feat(manager-ui-kit): add new YourComponent"
git push origin feature/MANAGER-#
`})}),`
`,n.jsx(e.h2,{id:"-maintenance",children:"📈 Maintenance"}),`
`,n.jsx(e.p,{children:"Regular maintenance tasks:"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"🔄 Update dependencies"}),`
`,n.jsx(e.li,{children:"📝 Update documentation"}),`
`,n.jsx(e.li,{children:"🧪 Run test suite"}),`
`,n.jsx(e.li,{children:"🔍 Review performance metrics"}),`
`]}),`
`,n.jsxs(e.p,{children:["Remember to follow the ",n.jsx(e.a,{href:"https://semver.org/",rel:"nofollow",children:"semantic versioning"})," guidelines when making changes to existing components."]})]})}function u(o={}){const{wrapper:e}={...s(),...o.components};return e?n.jsx(e,{...o,children:n.jsx(t,{...o})}):t(o)}export{u as default};
