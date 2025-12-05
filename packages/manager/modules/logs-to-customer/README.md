# Logs to customer module

## Overview

This module provides the necessary pages and components to add the "Logs to Customer" feature to a product page. It includes:

- Logs live tail
- Create, read, update, and delete subscriptions to data-streams

Built with **ODS v19** and **Tailwind CSS v3**.

## Requirements

Ensure your application has the following dependencies:

```json
{
  "dependencies": {
    "@ovh-ux/logs-to-customer": "^1.9.0",
    "@ovhcloud/ods-react": "^19.2.1",
    "@ovhcloud/ods-themes": "^19.2.1",
    "tailwindcss": "^3.4.4 || ^4.1.17"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.17",
    "autoprefixer": "^10.4.14"
  }
}
```

**Note:** This module is built with Tailwind CSS v3, but works with consumer apps using either v3 or v4.

## Configuration

### 1. PostCSS Configuration

**For Tailwind CSS v4:**

```javascript
import tailwindcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [tailwindcss(), autoprefixer()],
};
```

**For Tailwind CSS v3:**

```javascript
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### 2. Tailwind Configuration

Update your `tailwind.config.mjs` to include the module's component paths:

```javascript
import { createRequire } from 'node:module';
import path from 'node:path';
import baseConfig from '@ovh-ux/manager-tailwind-config';

const require = createRequire(import.meta.url);
const pkgDir = (name) => path.dirname(require.resolve(`${name}/package.json`));
const toGlob = (dir) => `${dir.replace(/\\/g, '/')}/**/*.{js,jsx,ts,tsx}`;

const logsToCustomerDir = pkgDir('@ovh-ux/logs-to-customer');

export default {
  ...baseConfig,
  content: [
    ...(baseConfig.content ?? []),
    './src/**/*.{js,jsx,ts,tsx}',
    toGlob(logsToCustomerDir),
  ],
  corePlugins: {
    preflight: false,
  },
};
```

### 3. Import Module Styles

Import the module's CSS in your application entry point:

```tsx
// In your index.tsx or main entry point
import '@ovh-ux/logs-to-customer/dist/style.css';
```

### 4. Configure your vite config

Add logs-to-customer vite config to your app

_**vite.config.mjs**_
```ts
import { defineConfig } from 'vite';
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { getLogsToCustomerConfig } from '@ovh-ux/logs-to-customer/vite-config';
import { resolve } from 'path';

const logsToCustomerConfig = getLogsToCustomerConfig();
const baseConfig = getBaseConfig(logsToCustomerConfig);

export default defineConfig({
  ...baseConfig,
  root: resolve(process.cwd()),
});
```

### 5. Vitest Configuration (for testing)

If you're running tests, update your `vitest.config.js` to handle ODS v19 CSS:

```javascript
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-utils/setup-test.ts'],
    css: true,
    deps: {
      inline: ['@ovhcloud/ods-react'],
    },
  },
});
```

## Usage

### Add the Module to Your Application

Create a logs page and integrate the `LogsToCustomerModule`:

```tsx
import { LogsToCustomerModule } from '@ovh-ux/logs-to-customer';

export default function LogsPage() {
  // ...

  return (
    <LogsToCustomerModule
      // Specify the API version for your product's logs endpoints
      logApiVersion="v2"
      // Specify the endpoint URLs regardless of the HTTP method
      logApiUrls={{
        logKind: `/path/to/${product.id}/log/kind`,
        logSubscription: `/path/to/${product.id}/log/subscription`,
        logUrl: `/path/to/${product.id}/log/url`,
      }}
      // Specify the IAM actions related to logs API endpoints
      logIamActions={{
        postSubscription: ['product:apiovh:log/subscription/create'],
        deleteSubscription: ['product:apiovh:log/subscription/delete'],
      }}
      // Specify the URN of your product
      resourceURN={product.iam.urn}
      // Optional: specify a string to add to the end of automatically generated tracking tags
      trackingOptions={{ trackingSuffix: 'myProduct' }}
    />
  );
}
```

### Configure your µapp routes

Configure your routes to allow the module to handle all logs-related sub-routes:

```tsx
// routes.tsx
<Route path="path/to/parent/component" Component={ParentComponent}>
  <Route
    path="path/to/logs/page/*"
    id="logs"
    Component={LogsPage}
  />
</Route>
// ...
```
> **Important**
> `'*'` is mandatory as routing is defined and managed inside the module
