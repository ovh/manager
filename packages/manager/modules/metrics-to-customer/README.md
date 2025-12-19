# Metrics to customer module

## overview
This module provides the integration surface to plug an Observability metrics feature set into a product page.

## Configuration

### add the package to your µApp

Add the package to your µApp:

`@ovh-ux/metrics-to-customer`

### update your vite application config inside your consumer µApp

```mjs
import { getBaseConfig } from '@ovh-ux/manager-vite-config';
import { getMetricsToCustomerConfig } from '@ovh-ux/metrics-to-customer/vite-config';

const metricsToCustomerConfig = getMetricsToCustomerConfig();
const baseConfig = getBaseConfig(metricsToCustomerConfig);

export default defineConfig({
  ...baseConfig,
  // ...
});
```

### update your tailwind config inside your consumer µApp

Import the custom Tailwind configuration provided by the module and extend your project's configuration with it.
Also, you need to add the module path to your application Tailwind configuration content array to generate the necessary utility classes.

```mjs
import metricsToCustomerTwConfig from '@ovh-ux/metrics-to-customer/tailwind-config';

export default {
  ...metricsToCustomerTwConfig,
  // ...
  content: [
    // ...
    path.join(
      path.dirname(require.resolve('@ovh-ux/metrics-to-customer')),
      '**/*.{js,jsx,ts,tsx}',
    ),
  ],
};
```

### add the module in your µApp

Create an Observability tab on your product dashboard and add the `MetricsToCustomerModule` to the page content.

```tsx
export default function ObservabilityMetricsPage() {
  return <MetricsToCustomerModule
            resourceName={resourceName} // resourceName (exp: d0a6031b-04c3-4b98-8dc5-0d2c10da99ba)
            productType={productType}   // productType  (exp: instances)
            resourceURN={resourceURN}   // resourceURN  (exp: `urn:v1:eu:resource:publicCloudProject:${project.project_id}/instance/${instanceId}`)
        />;
}
```
### configure your µApp routes (recommended - route components)

To allow the module to handle all observability-metrics related routes, configure your routes as follows:

_**routes.tsx**_
```tsx
// ...
<Route
    path={`{urls.observability}/*`}
    id="observability-metrics"
    Component={ObservabilityMetricsPage}
    handle={{
      tracking: {
      pageName: 'observability-metrics',
      pageType: PageType.dashboard,
    },
  }}
/>
// ...
```

> **Important**
> `'*'` is mandatory as routing is defined and managed inside the module

## Exports
- `MetricsToCustomerModule`
- `MetricsToCustomerRoutes` and `getMetricsToCustomerRoutes`
