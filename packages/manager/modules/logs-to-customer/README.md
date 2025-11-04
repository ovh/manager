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

### configure your µapp routes

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

### Troubleshooting

You might face to the following issue

```sh
LogMessages.component.tsx:XX Warning: Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for one of the following reasons:
1. You might have mismatching versions of React and the renderer (such as React DOM)
2. You might be breaking the Rules of Hooks
3. You might have more than one copy of React in the same app
See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.
```

To fix it, add the following `dedupe` vite configuration inside your consumer application

_**vite.config.mjs**_
```js
export default defineConfig({
  ...getBaseConfig(),
  resolve: {
    alias: {
      '@': resolve(join(process.cwd(), 'src')),
      ),
    },
    dedupe: ['@tanstack/react-virtual'],
  },
  root: resolve(process.cwd()),
});
```

