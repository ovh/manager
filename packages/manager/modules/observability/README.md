# Observability module

## overview

This module provides the necessary pages and components to add the "Observability" featured to a product page. It includes:

- Dashboard and Charts

## Configuration

### add the package to your uapp

To use this module, add the following package to your UApp:

`@ovh-ux/observability`

### update your application tailwind config

Add observability to the content of your application tailwind configuration `tailwind.config.mjs` in order to generate the necessary tailwind classes.

```mjs
//...
import observabilityTailwindConfig from '@ovh-ux/observability/tailwind.config';
//...
export default {
  //...
  ...observabilityTailwindConfig,
  //... 
  content: [
    // ...
    path.join(
      path.dirname(require.resolve('@ovh-ux/observability')),
      '**/*.{js,jsx,ts,tsx}',
    ),
  ],
};
```

### add the module in your uapp

To integrate the module into your UApp, create an Observability tab on your product dashboard and add the `ObservabilityModule` to the page content.

```tsx
export default function ObservabilityPage() {
  // ...
  return (
    <ObservabilityModule
      enabledFeatures={enabledFeatures}
      defaultActiveFeature={defaultActiveFeature} 
    />
  );
}
```

### configure your uapp routes

To allow the module to handle all logs-related routes, configure your routes as follows:

```tsx
// Import the module routes
import { getObservabilityRoute } from '@ovh-ux/observability';
import { ObsFeatureType } from "@ovh-ux/observability/src/types";
//...
{
    getObservabilityRoute(
      // enabled features
      [
        ObsFeatureType.Metrics,
        ObsFeatureType.Logs,    
      ],
      // default feature
      ObsFeatureType.Metrics
  )
}
```
