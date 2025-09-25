import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-DMscLk_r.js";import{M as s}from"./index-KONHwz82.js";import"./manager-react-components-lib.es-CBd9Txn3.js";import"./index-Bnop-kX6.js";import"./iframe-D56x9By5.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";import"./QueryClientProvider-DbnhbVMg.js";import"./index-D1HcsAmU.js";import"./context-Cuu9iSAu.js";const i=""+new URL("mrc-adding-component-U5pje9G1.png",import.meta.url).href;function t(o){const n={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",ul:"ul",...r(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(s,{title:"Manager React Components/Guidelines/New component ?"}),`
`,e.jsx(n.h1,{id:"how-to-add-a-new-component",children:"How to add a new component"}),`
`,e.jsx(n.p,{children:"This guide will walk you through the process of creating and integrating a new component into the Manager React Components library."}),`
`,e.jsx(n.p,{children:"Correcting, adding new features on an existing component."}),`
`,e.jsx(n.h2,{id:"-github-issues",children:"📋 Github issues"}),`
`,e.jsx(n.p,{children:"Before adding a new component, create a bug or add a new feature"}),`
`,e.jsxs(n.p,{children:["You have to go on the github issue page ",e.jsx(n.a,{href:"https://github.com/ovh/manager/issues",rel:"nofollow",children:"here"}),", then create a new issue :"]}),`
`,e.jsx("img",{src:i,alt:"Create mrc issues",width:"600"}),`
`,e.jsx(n.p,{children:"Please fill the form :"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"title"}),`
`,e.jsx(n.li,{children:"Component/Hook/utils/Other"}),`
`,e.jsx(n.li,{children:"description"}),`
`,e.jsx(n.li,{children:"When do you expect the component ?"}),`
`]}),`
`,e.jsx(n.p,{children:"Its a must have if you have a mock up give by the design"}),`
`,e.jsx(n.p,{children:"If you already have a Open PR, code sample or prototype, please share to us."}),`
`,e.jsx(n.h2,{id:"️-component-structure",children:"🏗️ Component Structure"}),`
`,e.jsx(n.p,{children:"A new component should follow this structure:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`src/
  components/
    your-component/
      __tests__
          your-component.test.tsx
      your-component.component.tsx
      your-component.types.ts
      index.ts
`})}),`
`,e.jsx(n.p,{children:"A new hook should follow this structure:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`src/
  hooks/
    your-custom-hook/
      __tests__
           your-custom-hook.test.tsx
      your-custom-hook.tsx
      your-custom-hook.types.ts
      index.ts
`})}),`
`,e.jsx(n.p,{children:"Adding story to manager-wiki"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`packages/manager-wiki/stories/managager-react-components/
  components/
    your-component/
      overview.mdx
      changelog.mdx
      documentation.mdx
      your-component.stories.ts
`})}),`
`,e.jsx(n.h2,{id:"-implementation-steps",children:"📝 Implementation Steps"}),`
`,e.jsx(n.h3,{id:"1--create-component-files",children:"1. 🎯 Create Component Files"}),`
`,e.jsx(n.p,{children:"First, create the necessary files in the correct directory:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`// your-component.component.tsx
import { OdsText } from '@ovhcloud/ods-components/react';
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
`,e.jsx(n.h3,{id:"2--define-types",children:"2. 📦 Define Types"}),`
`,e.jsxs(n.p,{children:["Create type definitions in ",e.jsx(n.code,{children:"your-component.types.ts"}),":"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`export interface YourComponentProps {
  prop1: string;
  prop2: number;
  optionalProp?: boolean;
}
`})}),`
`,e.jsx(n.h3,{id:"5--create-stories",children:"5. 📚 Create Stories"}),`
`,e.jsxs(n.p,{children:["Create Storybook stories in ",e.jsx(n.code,{children:"your-component.stories.tsx"}),":"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { Meta, StoryObj } from '@storybook/react';
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
`,e.jsx(n.h3,{id:"6--add-tests",children:"6. ✅ Add Tests"}),`
`,e.jsxs(n.p,{children:["Create unit tests in ",e.jsx(n.code,{children:"your-component.test.tsx"}),":"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`import { render, screen } from '@testing-library/react';
import { YourComponent } from './your-component.component';

describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent prop1="test" prop2={42} />);
    expect(screen.getByText('test - 42')).toBeInTheDocument();
  });
});
`})}),`
`,e.jsx(n.h3,{id:"6--export-component",children:"6. 📤 Export Component"}),`
`,e.jsxs(n.p,{children:["Add exports in ",e.jsx(n.code,{children:"index.ts"}),":"]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-tsx",children:`export { namedExport } from './your-component.component';
export type { nameExportType } from './your-component.types';
`})}),`
`,e.jsxs(n.blockquote,{children:[`
`,e.jsxs(n.p,{children:["❌ Do not export with ",e.jsx(n.code,{children:"*"}),", it can cause issues during the library build"]}),`
`]}),`
`,e.jsx(n.h2,{id:"-best-practices",children:"🎨 Best Practices"}),`
`,e.jsx(n.h3,{id:"component-design",children:"Component Design"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"🎯 Keep components focused and single-responsibility"}),`
`,e.jsx(n.li,{children:"🔄 Use TypeScript for type safety"}),`
`,e.jsx(n.li,{children:"📱 Ensure responsive design"}),`
`,e.jsx(n.li,{children:"♿ Follow accessibility guidelines"}),`
`]}),`
`,e.jsx(n.h3,{id:"code-style",children:"Code Style"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"📝 Use consistent naming conventions"}),`
`,e.jsx(n.li,{children:"📚 Add JSDoc comments for documentation"}),`
`,e.jsx(n.li,{children:"🧪 Write comprehensive tests"}),`
`,e.jsx(n.li,{children:"🔍 Include error handling"}),`
`]}),`
`,e.jsx(n.h3,{id:"performance",children:"Performance"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"⚡ Optimize rendering performance"}),`
`,e.jsx(n.li,{children:"📦 Minimize bundle size"}),`
`,e.jsx(n.li,{children:"🔄 Use proper memoization"}),`
`,e.jsx(n.li,{children:"🎯 Implement lazy loading when appropriate"}),`
`]}),`
`,e.jsx(n.h2,{id:"-code-review-checklist",children:"🔍 Code Review Checklist"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"[ ] Component follows the established structure"}),`
`,e.jsx(n.li,{children:"[ ] All necessary files are created"}),`
`,e.jsx(n.li,{children:"[ ] TypeScript types are properly defined"}),`
`,e.jsx(n.li,{children:"[ ] Unit tests are implemented"}),`
`,e.jsx(n.li,{children:"[ ] Storybook stories are created"}),`
`,e.jsx(n.li,{children:"[ ] Documentation is complete"}),`
`,e.jsx(n.li,{children:"[ ] Accessibility requirements are met"}),`
`,e.jsx(n.li,{children:"[ ] Performance is optimized"}),`
`,e.jsx(n.li,{children:"[ ] Code style guidelines are followed"}),`
`]}),`
`,e.jsx(n.h2,{id:"-additional-resources",children:"📚 Additional Resources"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://reactjs.org/docs/getting-started.html",rel:"nofollow",children:"React Documentation"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://www.typescriptlang.org/docs/",rel:"nofollow",children:"TypeScript Documentation"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://storybook.js.org/docs/react/get-started/introduction",rel:"nofollow",children:"Storybook Documentation"})}),`
`,e.jsx(n.li,{children:e.jsx(n.a,{href:"https://testing-library.com/docs/",rel:"nofollow",children:"Testing Library Documentation"})}),`
`]}),`
`,e.jsx(n.h2,{id:"-next-steps",children:"🚀 Next Steps"}),`
`,e.jsx(n.p,{children:"After creating your component:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:"📝 Update the component documentation"}),`
`,e.jsx(n.li,{children:"🔄 Create a pull request"}),`
`,e.jsx(n.li,{children:"✅ Request code review"}),`
`,e.jsx(n.li,{children:"🎯 Address review comments"}),`
`,e.jsx(n.li,{children:"📦 Prepare for release"}),`
`]}),`
`,e.jsx(n.h2,{id:"️-common-pitfalls",children:"⚠️ Common Pitfalls"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"❌ Avoid prop drilling"}),`
`,e.jsx(n.li,{children:"❌ Don't forget error boundaries"}),`
`,e.jsx(n.li,{children:"❌ Avoid unnecessary re-renders"}),`
`,e.jsx(n.li,{children:"❌ Don't skip accessibility testing"}),`
`]}),`
`,e.jsx(n.h2,{id:"-version-control",children:"🔄 Version Control"}),`
`,e.jsx(n.p,{children:"When committing your changes:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`git checkout -b feat/MANAGER-#
git add .
git commit -m "feat(manager-react-components): add new YourComponent"
git push origin feature/MANAGER-#
`})}),`
`,e.jsx(n.h2,{id:"-maintenance",children:"📈 Maintenance"}),`
`,e.jsx(n.p,{children:"Regular maintenance tasks:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"🔄 Update dependencies"}),`
`,e.jsx(n.li,{children:"📝 Update documentation"}),`
`,e.jsx(n.li,{children:"🧪 Run test suite"}),`
`,e.jsx(n.li,{children:"🔍 Review performance metrics"}),`
`]}),`
`,e.jsxs(n.p,{children:["Remember to follow the ",e.jsx(n.a,{href:"https://semver.org/",rel:"nofollow",children:"semantic versioning"})," guidelines when making changes to existing components."]})]})}function f(o={}){const{wrapper:n}={...r(),...o.components};return n?e.jsx(n,{...o,children:e.jsx(t,{...o})}):t(o)}export{f as default};
