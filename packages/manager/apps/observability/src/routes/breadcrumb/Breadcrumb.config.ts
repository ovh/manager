import { ICON_NAME } from '@ovhcloud/ods-react';

import { urls } from '@/routes/Routes.constants';
import { BreadcrumbConfig } from '@/types/breadcrumb/Breadcrumb.types';

/**
 * Default breadcrumb configuration for the Observability application
 *
 * Routes are matched in order, so more specific patterns should come first.
 * Use urls constants for patterns to ensure type safety and consistency.
 *
 * IMPORTANT: When defining routes with the same path depth, always put routes
 * with static segments before routes with dynamic segments.
 * Example: urls.tenantCreation must come before urls.tenantDashboard
 * Otherwise, the dynamic pattern will match first and treat "creation" as a tenantId.
 *
 * Configuration options per item:
 * - labelKey: Translation key (e.g., "tenants:listing.title")
 * - label: Static label (overrides labelKey)
 * - hidden: Hide this item from breadcrumb
 * - icon: ODS icon name (typically for root)
 * - path: Route path (if no label/labelKey, the last path param value is used as label)
 * - ariaLabel: Accessibility label
 */
export const breadcrumbConfig: BreadcrumbConfig = {
  root: {
    icon: ICON_NAME.home,
    ariaLabel: 'breadcrumb:root_aria_label',
    path: urls.root,
  },

  routes: [
    // Tenant Dashboard - Tags
    {
      pattern: urls.tenantTags,
      items: [
        { labelKey: 'breadcrumb:metrics', path: urls.metrics },
        { labelKey: 'breadcrumb:tenants', path: urls.tenants },
        { path: urls.tenantDashboard },
        { labelKey: 'breadcrumb:tags' },
      ],
    },

    // Tenant Dashboard - Subscription Delete
    {
      pattern: urls.deleteTenantSubscription,
      items: [
        { labelKey: 'breadcrumb:metrics', path: urls.metrics },
        { labelKey: 'breadcrumb:tenants', path: urls.tenants },
        { path: urls.tenantDashboard },
        { labelKey: 'breadcrumb:subscription', path: urls.tenantSubscription },
        { labelKey: 'breadcrumb:delete', hidden: true },
      ],
    },

    // Tenant Dashboard - Subscription
    {
      pattern: urls.tenantSubscription,
      items: [
        { labelKey: 'breadcrumb:metrics', path: urls.metrics },
        { labelKey: 'breadcrumb:tenants', path: urls.tenants },
        { path: urls.tenantDashboard },
        { labelKey: 'breadcrumb:subscription' },
      ],
    },

    // Tenant Edit
    {
      pattern: urls.editTenant,
      items: [
        { labelKey: 'breadcrumb:metrics', path: urls.metrics },
        { labelKey: 'breadcrumb:tenants', path: urls.tenants },
        { path: urls.tenantDashboard },
        { labelKey: 'breadcrumb:edit' },
      ],
    },

    // Tenant Creation (must be before Tenant Dashboard to match static 'creation' before dynamic :tenantId)
    {
      pattern: urls.tenantCreation,
      items: [
        { labelKey: 'breadcrumb:metrics', path: urls.metrics },
        { labelKey: 'breadcrumb:tenants', path: urls.tenants },
        { labelKey: 'breadcrumb:creation' },
      ],
    },

    // Tenants Onboarding
    {
      pattern: urls.tenantsOnboarding,
      items: [
        { labelKey: 'breadcrumb:metrics', path: urls.metrics },
        { labelKey: 'breadcrumb:tenants', path: urls.tenants },
        { hidden: true }, // onboarding label is hidden
      ],
    },

    // Tenant Dashboard (General Information)
    {
      pattern: urls.tenantDashboard,
      items: [
        { labelKey: 'breadcrumb:metrics', path: urls.metrics },
        { labelKey: 'breadcrumb:tenants', path: urls.tenants },
        { path: urls.tenantDashboard },
      ],
    },

    // Tenant Delete Modal
    {
      pattern: urls.deleteTenant,
      items: [
        { labelKey: 'breadcrumb:metrics', path: urls.metrics },
        { labelKey: 'breadcrumb:tenants', path: urls.tenants },
      ],
    },

    // Tenants Listing
    {
      pattern: urls.tenants,
      items: [
        { labelKey: 'breadcrumb:metrics', path: urls.metrics },
        { labelKey: 'breadcrumb:tenants' },
      ],
    },

    // Metrics root
    {
      pattern: urls.metrics,
      items: [{ labelKey: 'breadcrumb:metrics' }],
    },

    // Service Edit
    {
      pattern: urls.editService,
      items: [
        { labelKey: 'breadcrumb:settings', path: urls.settings },
        { labelKey: 'breadcrumb:services', path: urls.services },
        { labelKey: 'breadcrumb:edit' },
      ],
    },

    // Service Delete
    {
      pattern: urls.deleteService,
      items: [
        { labelKey: 'breadcrumb:settings', path: urls.settings },
        { labelKey: 'breadcrumb:services', path: urls.services },
        { labelKey: 'breadcrumb:delete', hidden: true },
      ],
    },

    // Services Listing
    {
      pattern: urls.services,
      items: [
        { labelKey: 'breadcrumb:settings', path: urls.settings },
        { labelKey: 'breadcrumb:services' },
      ],
    },

    // Settings root
    {
      pattern: urls.settings,
      items: [{ labelKey: 'breadcrumb:settings' }],
    },

    // Managed dashboards Onboarding
    {
      pattern: urls.managedDashboardsOnboarding,
      items: [
        { labelKey: 'breadcrumb:settings', path: urls.settings },
        { labelKey: 'breadcrumb:dashboards', path: urls.managedDashboards },
        { hidden: true }, // onboarding label is hidden
      ],
    },

    // Managed dashboards Listing
    {
      pattern: urls.managedDashboards,
      items: [
        { labelKey: 'breadcrumb:settings', path: urls.settings },
        { labelKey: 'breadcrumb:dashboards' },
      ],
    },

    // Managed dashboards Creation
    {
      pattern: urls.managedDashboardCreation,
      items: [
        { labelKey: 'breadcrumb:settings', path: urls.settings },
        { labelKey: 'breadcrumb:dashboards', path: urls.managedDashboards },
        { labelKey: 'breadcrumb:creation' },
      ],
    },
  ],

  fallbackToPathBased: true,
};

export default breadcrumbConfig;
