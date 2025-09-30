import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{u as r}from"./index-D_1QkM3g.js";import{M as l}from"./index-26vOBqU-.js";import"./index-Bnop-kX6.js";import"./iframe-BboHc1zZ.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function s(i){const e={a:"a",code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...r(),...i.components};return n.jsxs(n.Fragment,{children:[n.jsx(l,{title:"Guidelines/Quality Gates"}),`
`,n.jsx(e.h1,{id:"quality-gates",children:"Quality Gates"}),`
`,n.jsx(e.p,{children:"Quality gates are automated checks that ensure code meets our quality standards before it can be merged into the main branch. This guide outlines the different quality checks and their requirements for our React applications in the monorepo."}),`
`,n.jsx(e.h2,{id:"code-quality",children:"Code Quality"}),`
`,n.jsx(e.h3,{id:"linting",children:"Linting"}),`
`,n.jsx(e.p,{children:"We use multiple linters to ensure code quality across different file types:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`# Run all linters
yarn lint

# Run specific linters
yarn lint:js      # JavaScript files
yarn lint:tsx     # TypeScript/React files
yarn lint:css     # CSS/SCSS files
yarn lint:html    # HTML files
yarn lint:md      # Markdown files
`})}),`
`,n.jsx(e.h4,{id:"eslint-configuration",children:"ESLint Configuration"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-js",children:`// .eslintrc.cjs
module.exports = {
  extends: [
    '@ovh-ux/manager-vite-config/eslint',
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'react'],
  rules: {
    // Project specific rules
  },
};
`})}),`
`,n.jsx(e.h3,{id:"code-formatting",children:"Code Formatting"}),`
`,n.jsx(e.p,{children:"We use Prettier and other formatters to maintain consistent code style:"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`# Format all files
yarn format

# Format specific file types
yarn format:js    # JavaScript files
yarn format:tsx   # TypeScript/React files
yarn format:css   # CSS/SCSS files
yarn format:html  # HTML files
yarn format:md    # Markdown files
`})}),`
`,n.jsx(e.h2,{id:"build",children:"Build"}),`
`,n.jsx(e.p,{children:"The build process is crucial for our React applications in the monorepo."}),`
`,n.jsx(e.h3,{id:"build-commands",children:"Build Commands"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`# Build all packages
yarn build

# Build with Turbo
yarn build:turbo

# Clean build artifacts
yarn clean
yarn clean:dist
`})}),`
`,n.jsx(e.h3,{id:"build-requirements",children:"Build Requirements"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"TypeScript Compilation"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"No type errors"}),`
`,n.jsx(e.li,{children:"No implicit any"}),`
`,n.jsx(e.li,{children:"Proper type definitions"}),`
`,n.jsx(e.li,{children:"Proper module resolution"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Bundle Size"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Maximum bundle size: 500KB"}),`
`,n.jsx(e.li,{children:"Maximum chunk size: 200KB"}),`
`,n.jsx(e.li,{children:"Proper code splitting"}),`
`,n.jsx(e.li,{children:"Tree shaking optimization"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Performance"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"First contentful paint < 1.5s"}),`
`,n.jsx(e.li,{children:"Time to interactive < 3.5s"}),`
`,n.jsx(e.li,{children:"No performance regressions"}),`
`,n.jsx(e.li,{children:"Proper lazy loading"}),`
`]}),`
`]}),`
`]}),`
`,n.jsx(e.h2,{id:"testing",children:"Testing"}),`
`,n.jsx(e.p,{children:"We use Vitest for testing our applications."}),`
`,n.jsx(e.h3,{id:"test-commands",children:"Test Commands"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`# Run all tests
yarn test

# Run Jest tests
yarn test:jest

# Run script tests
yarn test:scripts
`})}),`
`,n.jsx(e.h3,{id:"coverage-requirements",children:"Coverage Requirements"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Minimum 80% line coverage"}),`
`,n.jsx(e.li,{children:"Minimum 70% branch coverage"}),`
`,n.jsx(e.li,{children:"All critical paths tested"}),`
`,n.jsx(e.li,{children:"All edge cases covered"}),`
`]}),`
`,n.jsx(e.h3,{id:"test-types",children:"Test Types"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Unit Tests (Jest)"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Component rendering"}),`
`,n.jsx(e.li,{children:"Function behavior"}),`
`,n.jsx(e.li,{children:"State management"}),`
`,n.jsx(e.li,{children:"Event handling"}),`
`,n.jsx(e.li,{children:"Custom hooks testing"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Integration Tests"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Component interactions"}),`
`,n.jsx(e.li,{children:"API integration"}),`
`,n.jsx(e.li,{children:"State flow"}),`
`,n.jsx(e.li,{children:"Error handling"}),`
`,n.jsx(e.li,{children:"Route testing"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"E2E Tests (Playwright)"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Critical user flows"}),`
`,n.jsx(e.li,{children:"Cross-browser compatibility"}),`
`,n.jsx(e.li,{children:"Performance metrics"}),`
`,n.jsx(e.li,{children:"Accessibility testing"}),`
`]}),`
`]}),`
`]}),`
`,n.jsx(e.h2,{id:"development",children:"Development"}),`
`,n.jsx(e.h3,{id:"development-commands",children:"Development Commands"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`# Start development server
yarn dev

# Start specific application
yarn start
`})}),`
`,n.jsx(e.h3,{id:"environment-requirements",children:"Environment Requirements"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Node.js v22"}),`
`,n.jsx(e.li,{children:"Yarn >= 1.21.1"}),`
`,n.jsx(e.li,{children:"Required system dependencies"}),`
`,n.jsx(e.li,{children:"Proper environment variables"}),`
`]}),`
`,n.jsx(e.h2,{id:"monorepo-management",children:"Monorepo Management"}),`
`,n.jsx(e.h3,{id:"workspace-commands",children:"Workspace Commands"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-bash",children:`# List package dependents
yarn list-dependents

# Generate new application
yarn generate:uapp

# Publish packages
yarn packages:publish
`})}),`
`,n.jsx(e.h3,{id:"workspace-structure",children:"Workspace Structure"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-json",children:`{
  "workspaces": {
    "packages": [
      "docs",
      "packages/components/*",
      "packages/manager/apps/*",
      "packages/manager/core/*",
      "packages/manager/modules/*",
      "packages/manager/tools/*",
      "packages/manager-cli",
      "packages/manager-react-components",
      "packages/manager-wiki"
    ]
  }
}
`})}),`
`,n.jsx(e.h2,{id:"quality-gate-checklist",children:"Quality Gate Checklist"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"[ ] All linters pass (js, tsx, css, html, md)"}),`
`,n.jsx(e.li,{children:"[ ] Code formatting is consistent"}),`
`,n.jsx(e.li,{children:"[ ] TypeScript compilation successful"}),`
`,n.jsx(e.li,{children:"[ ] Test coverage meets requirements"}),`
`,n.jsx(e.li,{children:"[ ] Build completes successfully"}),`
`,n.jsx(e.li,{children:"[ ] No security vulnerabilities"}),`
`,n.jsx(e.li,{children:"[ ] No performance regressions"}),`
`,n.jsx(e.li,{children:"[ ] Documentation updated"}),`
`,n.jsx(e.li,{children:"[ ] Storybook stories updated"}),`
`,n.jsx(e.li,{children:"[ ] Cross-package tests passing"}),`
`,n.jsx(e.li,{children:"[ ] Workspace dependencies verified"}),`
`]}),`
`,n.jsx(e.h2,{id:"reference",children:"Reference"}),`
`,n.jsx(e.h3,{id:"external-resources",children:"External Resources"}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://eslint.org/docs/latest/",rel:"nofollow",children:"ESLint Documentation"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://www.typescriptlang.org/docs/",rel:"nofollow",children:"TypeScript Documentation"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://jestjs.io/docs/getting-started",rel:"nofollow",children:"Jest Documentation"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://playwright.dev/docs/intro",rel:"nofollow",children:"Playwright Documentation"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://vitejs.dev/guide/",rel:"nofollow",children:"Vite Documentation"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://testing-library.com/docs/react-testing-library/intro/",rel:"nofollow",children:"React Testing Library"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://storybook.js.org/docs/react/get-started/introduction",rel:"nofollow",children:"Storybook Documentation"})}),`
`,n.jsx(e.li,{children:n.jsx(e.a,{href:"https://turbo.build/repo/docs",rel:"nofollow",children:"Turbo Documentation"})}),`
`]})]})}function x(i={}){const{wrapper:e}={...r(),...i.components};return e?n.jsx(e,{...i,children:n.jsx(s,{...i})}):s(i)}export{x as default};
