import{j as e}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-BbbfVuzK.js";import{S as i,a as l}from"./index-ChS17p17.js";import{M as o}from"./index-B3OJxjuP.js";import"./index-Bnop-kX6.js";import"./index-PzEU9Mdi.js";import"./index-oX_7i0mk.js";import"./index-D0sJu8id.js";import"./iframe-C_3YMFde.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function s(t){const n={a:"a",code:"code",h1:"h1",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...r(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(o,{title:"Core/generator/Overview"}),`
`,e.jsx(n.h1,{id:"manager-generator",children:"Manager Generator"}),`
`,e.jsx(i,{label:"Overview",level:2}),`
`,e.jsx(n.p,{children:"The Manager Generator is a powerful code generation tool designed to streamline the development of OVHcloud Manager applications. It provides a set of templates and utilities to quickly scaffold new applications, components, and API integrations while maintaining consistency with OVHcloud's development standards."}),`
`,e.jsx(i,{label:"Key Features",level:2}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Application Scaffolding"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Generate complete React applications"}),`
`,e.jsx(n.li,{children:"Configure TypeScript, Vite, and Tailwind"}),`
`,e.jsx(n.li,{children:"Set up testing infrastructure"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"API Integration"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Generate API client code"}),`
`,e.jsx(n.li,{children:"Create TypeScript types from API schemas"}),`
`,e.jsx(n.li,{children:"Support for both v2 and v6 API versions"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Component Generation"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Create reusable React components"}),`
`,e.jsx(n.li,{children:"Generate component tests"}),`
`,e.jsx(n.li,{children:"Set up component documentation"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Internationalization"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Generate translation files"}),`
`,e.jsx(n.li,{children:"Support for multiple regions"}),`
`,e.jsx(n.li,{children:"Configure i18n setup"}),`
`]}),`
`]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Project Configuration"}),":",`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Package.json generation"}),`
`,e.jsx(n.li,{children:"Vite configuration"}),`
`,e.jsx(n.li,{children:"Tailwind setup"}),`
`,e.jsx(n.li,{children:"TypeScript configuration"}),`
`]}),`
`]}),`
`]}),`
`,e.jsx(i,{label:"Usage",level:2}),`
`,e.jsx(n.h3,{id:"creating-a-new-application",children:"Creating a New Application"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-bash",children:`# Install the generator globally
npm install -g @ovh-ux/manager-generator

# Generate a new application
omg app
`})}),`
`,e.jsx(n.p,{children:"The generator will prompt you for:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Application name"}),`
`,e.jsx(n.li,{children:"Package name"}),`
`,e.jsx(n.li,{children:"Description"}),`
`,e.jsx(n.li,{children:"Target regions"}),`
`,e.jsx(n.li,{children:"API paths"}),`
`,e.jsx(n.li,{children:"Universe and subuniverse for tracking"}),`
`]}),`
`,e.jsx(n.h3,{id:"generated-application-structure",children:"Generated Application Structure"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{children:`my-app/
├── src/
│   ├── api/
│   │   └── generated/
│   ├── components/
│   ├── hooks/
│   ├── pages/
│   └── translations/
├── tests/
├── package.json
├── tsconfig.json
├── vite.config.mjs
└── tailwind.config.mjs
`})}),`
`,e.jsx(n.h3,{id:"api-integration",children:"API Integration"}),`
`,e.jsx(n.p,{children:"The generator automatically creates API client code:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`// Generated API client
import { apiClient } from '@ovh-ux/manager-core-api';

export const getResource = async (params: GetResourceParams) =>
  apiClient.v6.get(\`/api/resource/\${params.id}\`);

export const updateResource = async (params: UpdateResourceParams) =>
  apiClient.v6.put(\`/api/resource/\${params.id}\`, {
    data: params.data,
  });
`})}),`
`,e.jsx(i,{label:"Templates",level:2}),`
`,e.jsx(n.p,{children:"The generator includes several template types:"}),`
`,e.jsx(n.h3,{id:"application-templates",children:"Application Templates"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"Basic React application"}),`
`,e.jsx(n.li,{children:"PCI-specific application"}),`
`,e.jsx(n.li,{children:"Custom application with specific features"}),`
`]}),`
`,e.jsx(n.h3,{id:"component-templates",children:"Component Templates"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"React components with TypeScript"}),`
`,e.jsx(n.li,{children:"Component tests"}),`
`,e.jsx(n.li,{children:"Component documentation"}),`
`]}),`
`,e.jsx(n.h3,{id:"api-templates",children:"API Templates"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsx(n.li,{children:"API client generation"}),`
`,e.jsx(n.li,{children:"Type definitions"}),`
`,e.jsx(n.li,{children:"Query hooks"}),`
`]}),`
`,e.jsx(i,{label:"Best Practices",level:2}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Use Consistent Naming"}),": Follow the established naming conventions"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Type Safety"}),": Always use TypeScript for better development experience"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Testing"}),": Write tests for generated components and API clients"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Documentation"}),": Document any custom modifications to generated code"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Version Control"}),": Commit generated files to version control"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Code Review"}),": Review generated code before using in production"]}),`
`,e.jsxs(n.li,{children:[e.jsx(n.strong,{children:"Customization"}),": Extend generated code rather than modifying it directly"]}),`
`]}),`
`,e.jsx(i,{label:"Customization",level:2}),`
`,e.jsx(n.p,{children:"You can customize the generator by:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:"Creating custom templates"}),`
`,e.jsx(n.li,{children:"Modifying existing templates"}),`
`,e.jsx(n.li,{children:"Adding new generators"}),`
`,e.jsx(n.li,{children:"Extending the configuration"}),`
`]}),`
`,e.jsx(n.p,{children:"Example of custom template:"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-handlebars",children:`// custom-template.hbs
import React from 'react';

export const {{pascalCase name}} = () => {
  return (
    <div>
      {{description}}
    </div>
  );
};
`})}),`
`,e.jsx(i,{label:"Dos & Don'ts",level:2}),`
`,e.jsx(l,{dos:["Do use the generator for new applications","Do follow the established project structure","Do maintain generated code quality","Do update templates when standards change"],donts:["Do not modify generated files directly","Do not skip code generation steps","Do not ignore generated tests","Do not bypass type checking"]}),`
`,e.jsx(i,{label:"Support",level:2}),`
`,e.jsx(n.p,{children:"For issues, feature requests, or contributions:"}),`
`,e.jsxs(n.ul,{children:[`
`,e.jsxs(n.li,{children:["Create an issue in the ",e.jsx(n.a,{href:"https://github.com/ovh/manager",rel:"nofollow",children:"GitHub repository"})]}),`
`,e.jsx(n.li,{children:"Follow the contribution guidelines in the repository"}),`
`,e.jsx(n.li,{children:"Ensure all changes are properly tested"}),`
`,e.jsx(n.li,{children:"Update documentation for any new features"}),`
`]})]})}function y(t={}){const{wrapper:n}={...r(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(s,{...t})}):s(t)}export{y as default};
