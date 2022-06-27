# Architecture

## General information

The monorepo is powered by:

- [Yarn](https://yarnpkg.com) — Fast, reliable, and secure dependency management.
- [Lerna](https://lerna.js.org/) — A tool for managing JavaScript projects with multiple packages.
- [Jest](https://jestjs.io/) - A Javascript Testing framework with a focus on simplicity.

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

A `jest.config.js` is present in the root of the application, it allows for all projects under `components` and `manager` to share the same configuration.

```json
{
  "roots": ["<rootDir>/packages/components", "<rootDir>/packages/manager"]
}
```

If you have a project that requires a custom configuration, add a `jest.config.js` in your project that extends the root configuration and mention it in the root configuration under the options `projects` so that the test command continues to work.

```json
{
  "projects": ["<rootDir>/packages/manager/apps/container/jest.config.js"]
}
```

## Languages and Framework

The **Manager** application is using these following languages:

- HTML
- CSS ([Less.js](http://lesscss.org/), [SCSS](https://sass-lang.com/))
- JavaScript/Typescript

[AngularJS](https://angularjs.org/) used to be a widelys used MVW Framework to build [Single Page Applications](https://en.wikipedia.org/wiki/Single-page_application).
[ReactJS](https://fr.reactjs.org/) is used to build the container.

::: tip Information
We are exploring some new solutions to speed up the development workflow.
:::

## Build

[webpack](https://webpack.js.org/), [rollup.js](https://rollupjs.org) and [Vite](https://vitejs.dev/) are respectively used to build our applications, modules and components.

You can see more about our tooling [here](/guide/tools.md).

## Micro-FrontEnd

In order to enable the uFrontEnd architecture, we use what we call a `Container`. The container contains a standalone application and elements that are common to all applications.
The communication between the standalone application and the common elements is made possible thanks to the library [@ovh-ux/shell](https://github.com/ovh/manager/blob/master/packages/components/ovh-shell/README.md).

### Philosophy

The philosophy behind this, is not to be tied to a single framework and big monolithic applications. It allows more resiliency and for smaller apps, that are easier to maintain and to migrate. It also boosts the time to market, since all the common elements are already handled by the container.

### Communication

The standalone application is loaded inside an `iframe`. The iframe communicates with the container through [`window.postMessage`](https://developer.mozilla.org/fr/docs/Web/API/Window/postMessage) API. You don't have to worry about this part, since the library `@ovh-ux/shell` handles all this part for you, by exposing a set of plugins that you can use to communicate between a standalone application and the container.

![ufrontend schema](/manager/assets/img/ufrontend.jpeg)

Each app has to instantiate a `Shell` through the `registerApplication` method. This will allow the application to have access to the shell plugins and can use them for `environnement`, `navigation` etc. ( Check the shell library for more information on the subject ).

Once the shell is instantiated, it will enable communication between the `container` and the app through a message bus like in this picture.

![Container and shell communication and interaction diagramm](/manager/assets/img/container-shell-comm.png)

### Routing

The container + shell also keeps the iframe URL and the navigator URL are in sync. This way, you can freely route any application inside the iframe, without worrying about what it will do to the container.
You don't have to import anything, this in a out of the box feature.
