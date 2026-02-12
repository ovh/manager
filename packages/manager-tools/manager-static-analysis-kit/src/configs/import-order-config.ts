/**
 * Configuration for the import order sorting rule.
 */
export const importOrderConfig = [
  '^react$', // React always first
  '^react(-dom|-router-dom)?$', // React-related packages
  '<THIRD_PARTY_MODULES>', // External libraries
  '^@ovhcloud/(.*)$', // OVH ODS design system
  '^@ovh-ux/(.*)$', // OVH shared components
  '^@/(.*)$', // Aliased internal modules
  '^[./]', // Relative imports last
];
