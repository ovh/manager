import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-CdjcsXAS.js";import{M as l}from"./index-znkjjTxY.js";import"./index-Bnop-kX6.js";import"./iframe-CHNKH7Wl.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function i(s){const e={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...r(),...s.components};return n.jsxs(n.Fragment,{children:[n.jsx(l,{title:"Guidelines/Naming Convention"}),`
`,n.jsx(e.h1,{id:"naming-convention-in-react-apps",children:"Naming convention in React apps"}),`
`,n.jsx(e.p,{children:"This guide outlines the standard naming conventions to be followed in React applications to maintain consistency and readability across the codebase."}),`
`,n.jsx(e.h2,{id:"file-and-component-naming",children:"File and Component Naming"}),`
`,n.jsx(e.h3,{id:"react-components",children:"React Components"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Use PascalCase for component files and component names"}),`
`,n.jsx(e.li,{children:"Match the file name with the component name"}),`
`,n.jsxs(e.li,{children:["Use ",n.jsx(e.code,{children:".tsx"})," extension for TypeScript React files"]}),`
`]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Good
UserProfile.tsx
const UserProfile = () => { ... }

// ❌ Bad
userProfile.tsx
const userProfile = () => { ... }
`})}),`
`,n.jsx(e.h3,{id:"page-components",children:"Page Components"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsxs(e.li,{children:["Use PascalCase with ",n.jsx(e.code,{children:"Page"})," suffix"]}),`
`,n.jsxs(e.li,{children:["Place in ",n.jsx(e.code,{children:"pages"})," directory"]}),`
`,n.jsx(e.li,{children:"Match the route name"}),`
`]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Good
pages/
  UserProfile.page.tsx
  Dashboard.page.tsx
  Add.modal.tsx

// ❌ Bad
pages/
  userProfile.tsx
  dashboard.tsx
  settings.tsx
`})}),`
`,n.jsx(e.h2,{id:"variable-naming",children:"Variable Naming"}),`
`,n.jsx(e.h3,{id:"constants",children:"Constants"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Use UPPER_SNAKE_CASE for constant values"}),`
`,n.jsx(e.li,{children:"Group related constants in an object"}),`
`]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Good
const API_ENDPOINT = 'https://api.example.com';
const MAX_RETRY_COUNT = 3;

const STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
} as const;

// ❌ Bad
const apiEndpoint = 'https://api.example.com';
const maxRetryCount = 3;
`})}),`
`,n.jsx(e.h3,{id:"hooks",children:"Hooks"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Use camelCase"}),`
`,n.jsxs(e.li,{children:["Prefix with ",n.jsx(e.code,{children:"use"})]}),`
`,n.jsx(e.li,{children:"Describe the hook's purpose"}),`
`]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Good
const useUserData = () => { ... }
const useAuthStatus = () => { ... }
const useFormValidation = () => { ... }

// ❌ Bad
const userData = () => { ... }
const authStatus = () => { ... }
const formValidation = () => { ... }
`})}),`
`,n.jsx(e.h3,{id:"regular-variables",children:"Regular Variables"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Use camelCase"}),`
`,n.jsx(e.li,{children:"Use descriptive names"}),`
`,n.jsx(e.li,{children:"Avoid abbreviations unless common"}),`
`]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Good
const userProfile = { ... }
const isLoading = true
const errorMessage = '...'

// ❌ Bad
const up = { ... }
const loading = true
const err = '...'
`})}),`
`,n.jsx(e.h3,{id:"functions",children:"Functions"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Use camelCase"}),`
`,n.jsx(e.li,{children:"Use verb-noun format for actions"}),`
`,n.jsx(e.li,{children:"Use descriptive names"}),`
`]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Good
const fetchUserData = () => { ... }
const handleSubmit = () => { ... }
const validateForm = () => { ... }

// ❌ Bad
const userData = () => { ... }
const submit = () => { ... }
const validate = () => { ... }
`})}),`
`,n.jsx(e.h3,{id:"type-definitions",children:"Type Definitions"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Use PascalCase"}),`
`,n.jsx(e.li,{children:"Use descriptive names"}),`
`,n.jsx(e.li,{children:"Add appropriate suffixes"}),`
`]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`// ✅ Good
type UserProfile = { ... }
interface FormData { ... }
type ApiResponse<T> = { ... }

// ❌ Bad
type userProfile = { ... }
interface formData { ... }
type apiResponse<T> = { ... }
`})}),`
`,n.jsx(e.h2,{id:"folder-structure",children:"Folder Structure"}),`
`,n.jsxs(e.p,{children:["You can find the folder struture defined ",n.jsx(e.a,{href:"https://manager.pages.ovhcloud.tools/technical-documentation/manager/development-guidelines/application-folder-structure/",rel:"nofollow",children:"here"})]}),`
`,n.jsx(e.h3,{id:"assets-structure",children:"Assets Structure"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`src/
  assets/
    images/
      logo.svg
      icons/
    styles/
      global.css
      variables.css
    fonts/
`})}),`
`,n.jsx(e.h3,{id:"configuration-structure",children:"Configuration Structure"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{children:`src/
  config/
    api.config.ts
    app.config.ts
    routes.config.ts
    theme.config.ts
`})}),`
`,n.jsx(e.h3,{id:"best-practices-for-folder-structure",children:"Best Practices for Folder Structure"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Organization"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Group related files together"}),`
`,n.jsx(e.li,{children:"Keep components close to where they're used"}),`
`,n.jsx(e.li,{children:"Separate shared code from feature-specific code"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Naming"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Use kebab-case for folder names"}),`
`,n.jsx(e.li,{children:"Use PascalCase for component folders"}),`
`,n.jsx(e.li,{children:"Use descriptive names for feature folders"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"File Placement"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Keep related files together"}),`
`,n.jsx(e.li,{children:"Use index files for clean exports"}),`
`,n.jsx(e.li,{children:"Maintain consistent file structure"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Scalability"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Plan for growth"}),`
`,n.jsx(e.li,{children:"Keep folder structure flat when possible"}),`
`,n.jsx(e.li,{children:"Use feature folders for complex features"}),`
`]}),`
`]}),`
`]}),`
`,n.jsx(e.h2,{id:"code-review-checklist",children:"Code Review Checklist"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"[ ] Follow PascalCase for components"}),`
`,n.jsx(e.li,{children:"[ ] Use camelCase for variables and functions"}),`
`,n.jsx(e.li,{children:"[ ] Use UPPER_SNAKE_CASE for constants"}),`
`,n.jsxs(e.li,{children:["[ ] Prefix hooks with ",n.jsx(e.code,{children:"use"})]}),`
`,n.jsx(e.li,{children:"[ ] Use descriptive names"}),`
`,n.jsx(e.li,{children:"[ ] Follow folder structure conventions"}),`
`,n.jsx(e.li,{children:"[ ] Maintain consistent naming patterns"}),`
`,n.jsx(e.li,{children:"[ ] Document any exceptions"}),`
`]}),`
`,n.jsx(e.h2,{id:"reference",children:"Reference"}),`
`,n.jsx(e.h3,{id:"external-resources",children:"External Resources"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://reactjs.org/docs/faq-structure.html",rel:"nofollow",children:"React Naming Conventions"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html",rel:"nofollow",children:"TypeScript Naming Conventions"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://github.com/airbnb/javascript",rel:"nofollow",children:"Airbnb JavaScript Style Guide"})}),`
`]})]})}function p(s={}){const{wrapper:e}={...r(),...s.components};return e?n.jsx(e,{...s,children:n.jsx(i,{...s})}):i(s)}export{p as default};
