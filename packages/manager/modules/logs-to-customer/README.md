# Logs to customer module

## Overview

This module provides the necessary pages and components to add the "Logs to Customer" feature to a product page. It includes:

- Logs live tail
- Create, read, update, and delete subscriptions to data-streams

## Version Compatibility

| Version | Design System | Component Library | Last Stable |
|---------|---------------|-------------------|-------------|
| v1.x    | ODS 18        | MRC               | 1.12.0      |
| v2.x    | ODS 19        | MUK               | latest      |

## Configuration

### Add the package to your uapp

To use this module, add the following package to your UApp:

`@ovh-ux/logs-to-customer`

### Update your application tailwind config

Add logs-to-customer to the content of your application tailwind configuration `tailwind.config.mjs` in order to generate the necessary tailwind classes.

```mjs
export default {
  //...
  content: [
    // ...
    path.join(
      path.dirname(require.resolve('@ovh-ux/logs-to-customer')),
      '**/*.{js,jsx,ts,tsx}',
    ),
  ],
};
```

### Add the module in your uapp

To integrate the module into your UApp, create a log tab on your product dashboard and add the `LogsToCustomerModule` to the page content.

**Important**: You must import the CSS file in your app entry point (e.g., `index.tsx`) to ensure styles are loaded globally:

```tsx
// app entry point
import '@ovh-ux/logs-to-customer/dist/style.css';
```

```tsx
// component
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

To allow the module to handle all logs-related routes, configure your routes as follows:


_**routes.tsx**_
```tsx

// ...
<Route path="path/to/parent/component" Component={ParentComponent} id="parent-component">
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


### configure your vite config

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
