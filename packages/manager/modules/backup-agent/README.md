# Backup Agent module

## overview

This module provides the necessary pages and components to add the "Backup Agent" feature to a product page. It includes:

- Backup agent management interface
- Configuration and monitoring capabilities
- Enterprise, Baremetal scope support

## Configuration

### add the package to your uapp

To use this module, add the following package to your UApp:

`@ovh-ux/backup-agent`

### update your package.json dependencies

Add the backup-agent package to your dependencies:

```json
{
  "dependencies": {
    "@ovh-ux/backup-agent": "*"
  }
}
```

### update your application vite config

Add the backup-agent translation files to your Vite configuration using `vite-plugin-static-copy`:

```js
import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const baseConfig = getBaseConfig();

const BACKUP_AGENT_PACKAGE = '@ovh-ux/backup-agent';

export default defineConfig({
  ...baseConfig,
  root: resolve(process.cwd()),
  plugins: [
    ...baseConfig.plugins,
    viteStaticCopy({
      targets: [{
        src: `${dirname(require.resolve(BACKUP_AGENT_PACKAGE))}/../public/**/*`,
        dest: `translations/@ovh-ux/backup-agent`,
      }],
    }),
  ]
});
```

Don't forget to install the required dev dependency: `vite-plugin-static-copy`

### add css config for tailwind

```js
import baseConfig from '@ovh-ux/manager-tailwind-config';
import path from 'node:path';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const pkgDir = (name) => path.dirname(require.resolve(`${name}/package.json`));
const toGlob = (dir) => `${dir.replace(/\\/g, '/')}/**/*.{js,jsx,ts,tsx}`;

const reactComponentsDir = pkgDir('@ovh-ux/manager-react-components');
const backupAgentModuleDir = pkgDir('@ovh-ux/backup-agent');   // Add backup agent dir resolution

const baseTailwindConfig = [
  ...(baseConfig.content ?? []),
  './src/**/*.{js,jsx,ts,tsx}',
  toGlob(reactComponentsDir),
  toGlob(backupAgentModuleDir)    // Add it on base tailwind config
];

/** @type {import('tailwindcss').Config} */
export default {
  ...baseConfig,
  content: baseTailwindConfig,
  corePlugins: {
    preflight: false,
  },
};
```

### add the context provider in your main layout

Wrap your application with the `BackupAgentContext.Provider` in your main layout:

```tsx
import { BackupAgentContext } from '@ovh-ux/backup-agent';
import { appName } from '@/App.constants';

export default function MainLayout() {
  // ...

  return (
    <BackupAgentContext.Provider value={{ appName, scope: 'Enterprise' }}>
      <Suspense fallback={null}>
        <Outlet />
      </Suspense>
    </BackupAgentContext.Provider>
  );
}
```

### configure your uapp routes

To allow the module to handle all backup-agent-related routes, configure your routes as follows:

```tsx
// Import the module routes
import { BackupAgentRoutes } from '@ovh-ux/backup-agent';
//...

export default (
  <>
    <Route path="/" element={<MainLayoutPage />}>
      {/* Your other routes */}
      {BackupAgentRoutes}
      <Route path="*" element={<NotFound />} />
    </Route>
  </>
);
```

## Context Configuration

The `BackupAgentContext` accepts the following properties:

- `appName`: The name of your application
- `scope`: The scope of the backup agent (e.g., 'Enterprise', 'Baremetal')


## Hot reload

To enable the hot reloading during the development, please execute the following command:

```bash
yarn dev:watch --filter="@ovh-ux/backup-agent"
```

> Note: This can't works if package is not on the workspace. Think to execute : `pm:prepare:legacy:workspace` before
