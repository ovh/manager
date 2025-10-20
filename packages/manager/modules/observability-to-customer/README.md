# Observability to customer module

## overview
This module provides the integration surface to plug an Observability feature set into a product page.

## Configuration

### add the package to your uapp

Add the package to your UApp:

`@ovh-ux/observability-to-customer`

### update your application tailwind config

Import the custom Tailwind configuration provided by the module and extend your project's configuration with it.
Add the module path to your application Tailwind configuration content array to generate the necessary utility classes.

```mjs
import observabilityTailwindConfig from '@ovh-ux/observability-to-customer/tailwind.config';

export default {
  ...observabilityTailwindConfig,
  // ...
  content: [
    // ...
    path.join(
      path.dirname(require.resolve('@ovh-ux/observability-to-customer')),
      '**/*.{js,jsx,ts,tsx}',
    ),
  ],
};
```

### add the module in your uapp

Create an Observability tab on your product dashboard and add the `ObservabilityToCustomerModule` to the page content.

```tsx
export default function ObservabilityPage() {
  return <ObservabilityToCustomerModule />;
}
```
### configure your uapp routes

To allow the module to handle observability-related routes, configure your routes as follows:

```tsx
// Import the module routes
import { observabilityRoutes } from '@ovh-ux/observability-to-customer';
// ...

export default [
  // ...
  {
    // Add the `*` to let React Router know that sub-routes will be handled by children
    path: `path/to/product/observability/*`,
    ...lazyRouteConfig(() => import('@/pages/dashboard/observability/Observability.page')),
    // Use the module routes here
    children: [...observabilityRoutes],
  },
  // ...
];
```

## Exports
- `ObservabilityToCustomerModule`
- `observabilityRoutes`, `getObservabilityRoute`, and `lazyRouteConfig`
