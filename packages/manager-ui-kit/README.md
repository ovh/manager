# ⚛️⚡ Manager UI Kit Library

Design-system library for OVHcloud Manager µ-apps.

## Features

- **Unified Entry Point for Manager Development:** Access all Manager components, hooks, and utilities from a single, streamlined library — eliminating dependency clutter, simplifying imports, and accelerating development with one consistent source of truth.
- **Built on OVHcloud Design System v19:** Harnesses the power and consistency of OVHcloud’s latest design principles — ensuring visual harmony, modern aesthetics, and a unified user experience across all Manager applications. Elimination of shadow DOM for simplified tests.
- **Absorb Breaking Changes from ODS:** As MUK exposes wrappers for every ODS components, in future MUK can absorb the pressure of ODS braking change to reduce the impact on µ-apps
- **Exclusive Manager Components:** Includes purpose-built Manager-only components such as Datagrid, layouts, Modals, Tags Management and more — crafted specifically to meet complex product needs and streamline development across Manager platforms.
- **Accessibility by Design:** Every component is crafted with WCAG-compliant accessibility in mind, ensuring inclusivity and usability for all users right out of the box.
- **Optimized for Performance:** Engineered for scalability and speed — with Datagrid virtualization that efficiently handles massive data sets while keeping interfaces lightning fast.
- **Tree-Shakeable Architecture:** Designed with modular exports that support tree-shaking, ensuring your applications load only what they need — reducing bundle size, improving load times, and boosting overall performance.
- **Developer-Friendly Documentation:** Explore an interactive documentation hub on Manager-Wiki, featuring live examples, ready-to-use code snippets, and detailed guidelines to speed up adoption and integration.

## Usage

To use the Manager UI Kit in your project,

1.  Add a dependency in your app,

```
yarn add @ovhcloud/muk
```

2.  Import CSS in your app,

```
 import '@ovh-ux/muk/dist/style.css';
```

**Note:** This requirement is temporary and will no longer be needed with future releases.

3. Import components in your tsx file and use it as per your needs,

```tsx
import { Badge, BADGE_COLOR, BADGE_SIZE } from '@ovh-ux/muk';

return (
  <Badge color={BADGE_COLOR.information} size={BADGE_SIZE.md}>
    Active
  </Badge>
);
```

## Contributing

For development guidelines, refer our [documentation](https://ovh.github.io/manager/storybook-static/index.html?path=/docs/manager-ui-kit-guidelines-new-component--technical-information).

Request new component [here](https://github.com/ovh/manager/issues/new?template=manager_components_feature_request.yml).
Report a bug [here](https://github.com/ovh/manager/issues/new?template=manager_components_bug_report.yml).

## Useful Commands

Run the commands using `yarn` package manager,

- `build`: Generates the production build of the package.
- `test`: Run all tests to validate code functionality and quality.
- `test:ci`: Runs the test suite and reports code coverage metrics.
- `lint:modern`: Check code for linting errors and enforce coding standards.
- `lint:modern:fix`: Runs the `lint:modern` with fix option to automatically fix the reported issues
