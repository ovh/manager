# Architecture

## General information

The monorepo is powered by:

- [Yarn](https://yarnpkg.com) — Fast, reliable, and secure dependency management.
- [Lerna](https://lerna.js.org/) — A tool for managing JavaScript projects with multiple packages.

Several [workspaces](https://yarnpkg.com/lang/en/docs/workspaces/) are configured and you can find the list in the root [`package.json`](https://github.com/ovh/manager/blob/master/package.json#L7-L12) file.

```json
{
  "workspaces": [
    "packages/components/*",
    "packages/manager/apps/*",
    "packages/manager/modules/*",
    "packages/manager/tools/*"
  ],
  …,
}
```

## Languages and Framework

The **Manager** application is using these following languages:

- HTML
- CSS ([Less.js](http://lesscss.org/), [SCSS](https://sass-lang.com/))
- JavaScript

[AngularJS](https://angularjs.org/) used to be a widelys used MVW Framework to build [Single Page Applications](https://en.wikipedia.org/wiki/Single-page_application).

::: tip Information
We are exploring some new solutions to speed up the development workflow.
:::

## Build

[webpack](https://webpack.js.org/) and [rollup.js](https://rollupjs.org) are respectively used to build our applications, modules and components.

You can see more about our tooling [here](/guide/tools.md).
