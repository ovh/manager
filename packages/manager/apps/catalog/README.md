# Manager Catalog


## Prerequisites

- [Git](https://git-scm.com)
- [Node.js](https://nodejs.org/en/) ^16
- [Yarn](https://yarnpkg.com/lang/en/) >= 1.21.1
- Supported OSes: GNU/Linux, macOS and Windows

To install these prerequisites, you can follow the [How To section](https://ovh.github.io/manager/how-to/) of the documentation.

## Install

```sh
# Clone the repository
$ git clone https://github.com/ovh/manager.git

# Go to the project root
$ cd manager

# If you are using nvm
$ nvm use

# Install
$ yarn install
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```bash
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://kit.svelte.dev/docs/adapters) for your target environment.
