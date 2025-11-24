export const HELP_PAGE = `
Usage:
  yarn generate:uapp:page --app <appName> --page <PageName>

Description:
  Generates a new route page inside:
    packages/apps/<appName>/src/pages/

  Applies naming rules:
    • File: PascalCase.page.tsx
    • Folder: src/pages/
    • Example: UserDashboard.page.tsx

Options:
  --app       Name of the target application        (required)
  --page      Page name (PascalCase expected)       (required)
  -h, --help  Show this help message

Examples:
  yarn generate:uapp:page --app billing --page UserDashboard
  → creates packages/apps/billing/src/pages/UserDashboard.page.tsx
`;

export const HELP_HOOK = `
Usage:
  yarn generate:uapp:hook --app <appName> --hook <HookName>

Description:
  Generates a new React hook file inside:
    packages/apps/<appName>/src/hooks/

  Applies naming rules:
    • File must start with \`use\`
    • File: PascalCase.ts (static-analysis-kit enforces this)
    • Folder: src/hooks/
    • Example: useUser.ts

Options:
  --app       Name of the target application                (required)
  --hook      Hook name (must start with "use")             (required)
  -h, --help  Show this help message

Examples:
  yarn generate:uapp:hook --app billing --hook useBilling
  → creates packages/apps/billing/src/hooks/UseBilling.ts
`;

export const HELP_API = `
Usage:
  yarn generate:uapp:api --app <appName> --api <ApiName>

Description:
  Generates a new API client file inside:
    packages/apps/<appName>/src/data/

  Applies naming rules:
    • File: PascalCase.api.ts
    • Folder: src/data/
    • Example: User.api.ts

Options:
  --app       Name of the target application     (required)
  --api       Name of the API to generate        (required)
  -h, --help  Show this help message

Examples:
  yarn generate:uapp:api --app billing --api User
  → creates packages/apps/billing/src/data/User.api.ts
`;

export const HELP_COMPONENT = `
Usage:
  yarn generate:uapp:component --app <appName> --component <ComponentName>

Description:
  Generates a new React component file inside:
    packages/apps/<appName>/src/components/

  Applies naming rules:
    • File: PascalCase.component.tsx
    • Folder: src/components/
    • Example: UserCard.component.tsx

Options:
  --app         Name of the target application        (required)
  --component   Component name (PascalCase expected)   (required)
  -h, --help    Show this help message

Examples:
  yarn generate:uapp:component --app billing --component UserCard
  → creates packages/apps/billing/src/components/UserCard.component.tsx
`;

export const HELP_APPLICATION = `
Usage:
  yarn generate:uapp

Description:
  Interactively creates a complete OVHcloud Manager application inside:
    packages/apps/<appName>/

  This command:
    • Copies the application base template
    • Applies template variable replacements
    • Configures package.json and metadata
    • Generates initial src/ structure (pages, components, routes, i18n, etc.)
    • Registers the new application in the workspace

Options:
  -h, --help     Show this help message

Notes:
  This command does not accept flags. The following values will be requested
  through an interactive prompt:
    • Application name (kebab-case)
    • NPM package name (@ovh-ux/manager-<name>)
    • Description
    • Universe, sub-universe, and level2 tracking metadata
    • Supported regions
    • Additional template options based on your template definitions

Examples:
  yarn generate:uapp
  → starts an interactive wizard guiding you through all required fields.
`;

export const HELP_MODULE = `
Usage:
  yarn generate:module

Description:
  Interactively creates a new OVHcloud Manager module inside:
    packages/manager/modules/<moduleName>/

  This command:
    • Copies the module base template
    • Applies template variable replacements
    • Configures package.json (name, privacy, description)
    • Generates initial src/ structure
    • Applies the correct TypeScript configuration based on module type (react or node)
    • Optionally prepares translation folders if requested

Options:
  -h, --help     Show this help message

Notes:
  This command does not accept flags. The following values will be requested
  through an interactive prompt:
    • Module name (kebab-case)
    • NPM package name (@ovh-ux/manager-<name>-module)
    • Description
    • Whether the module is private or public
    • Module type (React frontend or Node/pure TypeScript module)
    • Whether the module includes translations

Examples:
  yarn generate:module
  → starts an interactive wizard guiding you through all required module fields.
`;
