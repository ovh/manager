import{j as n}from"./jsx-runtime-BRNY0I4F.js";import{u as l}from"./index-BbLPDwHm.js";import{M as t}from"./index-CKSIDW05.js";import"./index-Bnop-kX6.js";import"./iframe-DqxQzjvh.js";import"./index-D0sJu8id.js";import"./index-DOoWsluG.js";import"./index-DrFu-skq.js";function i(s){const e={code:"code",h1:"h1",h2:"h2",h3:"h3",h4:"h4",li:"li",ol:"ol",p:"p",pre:"pre",strong:"strong",ul:"ul",...l(),...s.components};return n.jsxs(n.Fragment,{children:[n.jsx(t,{title:"Guidelines/Github actions"}),`
`,n.jsx(e.h1,{id:"github-actions",children:"GitHub Actions"}),`
`,n.jsx(e.p,{children:"This document outlines the GitHub Actions workflows and templates used in our project for continuous integration, quality assurance, and project management."}),`
`,n.jsx(e.h2,{id:"workflows",children:"Workflows"}),`
`,n.jsx(e.h3,{id:"quality-assurance",children:"Quality Assurance"}),`
`,n.jsx(e.h4,{id:"linter",children:"Linter"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-yaml",children:`# .github/workflows/linter.yaml
name: Linter
on: [push, pull_request]
jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
`})}),`
`,n.jsx(e.p,{children:"Runs ESLint checks on every push and pull request to ensure code quality."}),`
`,n.jsx(e.h4,{id:"commit-lint",children:"Commit Lint"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-yaml",children:`# .github/workflows/commitlint.yaml
name: Commit Lint
on: [push, pull_request]
jobs:
  commitlint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run commitlint
`})}),`
`,n.jsx(e.p,{children:"Ensures commit messages follow our conventional commit format."}),`
`,n.jsx(e.h3,{id:"testing",children:"Testing"}),`
`,n.jsx(e.h4,{id:"bdd-tests",children:"BDD Tests"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-yaml",children:`# .github/workflows/run-bdd-tests.yml
name: BDD Tests
on: [push, pull_request]
jobs:
  bdd-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run test:bdd
`})}),`
`,n.jsx(e.p,{children:"Runs Behavior-Driven Development tests to ensure feature functionality."}),`
`,n.jsx(e.h3,{id:"documentation",children:"Documentation"}),`
`,n.jsx(e.h4,{id:"github-pages",children:"GitHub Pages"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-yaml",children:`# .github/workflows/gh-pages.yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run build:docs
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
`})}),`
`,n.jsx(e.p,{children:"Deploys documentation to GitHub Pages."}),`
`,n.jsx(e.h3,{id:"project-management",children:"Project Management"}),`
`,n.jsx(e.h4,{id:"pr-triage",children:"PR Triage"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-yaml",children:`# .github/workflows/pr-triage.yml
name: PR Triage
on:
  pull_request:
    types: [opened, synchronize, reopened]
jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: PR Triage
        uses: actions/github-script@v6
`})}),`
`,n.jsx(e.p,{children:"Automatically labels and assigns pull requests."}),`
`,n.jsx(e.h4,{id:"auto-label-merge-conflicts",children:"Auto Label Merge Conflicts"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-yaml",children:`# .github/workflows/auto-label-merge-conflicts.yaml
name: Auto Label Merge Conflicts
on:
  pull_request:
    types: [opened, synchronize, reopened]
jobs:
  label:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Label Merge Conflicts
        uses: actions/github-script@v6
`})}),`
`,n.jsx(e.p,{children:"Automatically labels pull requests with merge conflicts."}),`
`,n.jsx(e.h3,{id:"release-management",children:"Release Management"}),`
`,n.jsx(e.h4,{id:"auto-pr-release",children:"Auto PR Release"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-yaml",children:`# .github/workflows/auto-pr-release.yaml
name: Auto PR Release
on:
  push:
    branches: [main]
jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Create Release PR
        uses: actions/github-script@v6
`})}),`
`,n.jsx(e.p,{children:"Automatically creates release pull requests."}),`
`,n.jsx(e.h4,{id:"release-branch-checker",children:"Release Branch Checker"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-yaml",children:`# .github/workflows/release-branch-checker.yaml
name: Release Branch Checker
on:
  push:
    branches: [main]
jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check Release Branch
        uses: actions/github-script@v6
`})}),`
`,n.jsx(e.p,{children:"Validates release branch status."}),`
`,n.jsx(e.h2,{id:"templates",children:"Templates"}),`
`,n.jsx(e.h3,{id:"pull-request-template",children:"Pull Request Template"}),`
`,n.jsxs(e.p,{children:["Located at ",n.jsx(e.code,{children:".github/PULL_REQUEST_TEMPLATE.md"}),", this template helps contributors provide necessary information when creating pull requests."]}),`
`,n.jsx(e.h3,{id:"release-template",children:"Release Template"}),`
`,n.jsxs(e.p,{children:["Located at ",n.jsx(e.code,{children:".github/RELEASE_TEMPLATE.md"}),", this template standardizes the release process."]}),`
`,n.jsx(e.h3,{id:"issue-templates",children:"Issue Templates"}),`
`,n.jsxs(e.p,{children:["Located in ",n.jsx(e.code,{children:".github/ISSUE_TEMPLATE/"}),", these templates help users submit well-structured issues."]}),`
`,n.jsx(e.h2,{id:"configuration-files",children:"Configuration Files"}),`
`,n.jsx(e.h3,{id:"codeowners",children:"CODEOWNERS"}),`
`,n.jsxs(e.p,{children:["Located at ",n.jsx(e.code,{children:".github/CODEOWNERS"}),", this file defines the default owners for different parts of the codebase."]}),`
`,n.jsx(e.h3,{id:"labeler",children:"Labeler"}),`
`,n.jsxs(e.p,{children:["Located at ",n.jsx(e.code,{children:".github/labeler.yml"}),", this configuration automatically labels pull requests based on file changes."]}),`
`,n.jsx(e.h2,{id:"best-practices",children:"Best Practices"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Workflow Organization"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Separate workflows for different concerns"}),`
`,n.jsx(e.li,{children:"Clear naming conventions"}),`
`,n.jsx(e.li,{children:"Proper trigger conditions"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Security"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"No sensitive data in logs"}),`
`,n.jsx(e.li,{children:"Proper secret management"}),`
`,n.jsx(e.li,{children:"Minimal permissions"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Performance"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Efficient caching"}),`
`,n.jsx(e.li,{children:"Parallel job execution"}),`
`,n.jsx(e.li,{children:"Resource optimization"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Maintenance"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Regular updates of actions"}),`
`,n.jsx(e.li,{children:"Clear documentation"}),`
`,n.jsx(e.li,{children:"Version pinning"}),`
`]}),`
`]}),`
`]}),`
`,n.jsx(e.h2,{id:"troubleshooting",children:"Troubleshooting"}),`
`,n.jsx(e.p,{children:"Common issues and their solutions:"}),`
`,n.jsxs(e.ol,{children:[`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Workflow Failures"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Check Node.js version compatibility"}),`
`,n.jsx(e.li,{children:"Verify dependency versions"}),`
`,n.jsx(e.li,{children:"Review workflow logs"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"PR Issues"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Check labeler configuration"}),`
`,n.jsx(e.li,{children:"Verify CODEOWNERS file"}),`
`,n.jsx(e.li,{children:"Review PR template"}),`
`]}),`
`]}),`
`,n.jsxs(e.li,{children:[`
`,n.jsx(e.p,{children:n.jsx(e.strong,{children:"Release Issues"})}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Check release template"}),`
`,n.jsx(e.li,{children:"Verify branch protection rules"}),`
`,n.jsx(e.li,{children:"Review release workflow"}),`
`]}),`
`]}),`
`]})]})}function m(s={}){const{wrapper:e}={...l(),...s.components};return e?n.jsx(e,{...s,children:n.jsx(i,{...s})}):i(s)}export{m as default};
