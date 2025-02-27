# Logs to customer module

## overview

This module provides the necessary pages and components to add the "Logs to Customer" feature to a product page. It includes:

- Logs live tail
- Create, read, update, and delete subscriptions to data-streams

## Configuration

### add the package to your uapp

To use this module, add the following package to your UApp:

`@ovh-ux/logs-to-customer`

### update your application tailwind config

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

### add the module in your uapp

To integrate the module into your UApp, create a log tab on your product dashboard and add the `LogsToCustomerModule` to the page content.

```tsx
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

### configure your uapp routes

To allow the module to handle all logs-related routes, configure your routes as follows:

```tsx
// Import the module routes
import { logsRoutes } from '@ovh-ux/logs-to-customer';
//...

export default [
  // ...
  {
    // Add the `*` to let React Router know that all sub-routes will be handled by the children config
    path: `path/to/product/log/page/*`,
    ...lazyRouteConfig(() => import('@/pages/dashboard/logs/Logs.page')),
    // Use the module routes here
    children: [...logsRoutes],
  },
  // ...
];
```
