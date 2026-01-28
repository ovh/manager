import { ICON_NAME } from '@ovhcloud/ods-react';

import { subroutes } from '@/routes/Routes.constants';
import { BreadcrumbConfig } from '@/types/breadcrumb/Breadcrumb.types';

/**
 * Default breadcrumb configuration for the Observability application
 *
 * Routes are matched in order, so more specific patterns should come first.
 * Use `:param` for dynamic segments that will be replaced with actual values.
 *
 * IMPORTANT: When defining routes with the same path depth, always put routes
 * with static segments before routes with dynamic segments.
 * Example: `/tenants/:resourceName/creation` must come before `/tenants/:resourceName/:tenantId`
 * Otherwise, the dynamic pattern will match first and treat "creation" as a tenantId.
 *
 * Configuration options per item:
 * - labelKey: Translation key (e.g., "tenants:listing.title")
 * - label: Static label (overrides labelKey)
 * - hidden: Hide this item from breadcrumb
 * - icon: ODS icon name (typically for root)
 * - useSegmentAsLabel: Use the URL segment value as label
 * - ariaLabel: Accessibility label
 */
export const breadcrumbConfig: BreadcrumbConfig = {
  root: {
    icon: ICON_NAME.home,
    ariaLabel: 'breadcrumb:root_aria_label',
    path: '/',
  },

  routes: [
    // Tenant Dashboard - Tags
    {
      pattern: `/${subroutes.metrics}/${subroutes.tenants}/:resourceName/:tenantId/${subroutes.tags}`,
      items: [
        { labelKey: 'breadcrumb:metrics', path: `/${subroutes.metrics}` },
        {
          labelKey: 'breadcrumb:tenants',
          path: `/${subroutes.metrics}/${subroutes.tenants}`,
        },
        {
          useSegmentAsLabel: true,
          path: `/${subroutes.metrics}/${subroutes.tenants}/:resourceName/:tenantId`,
        },
        { labelKey: 'breadcrumb:tags' },
      ],
    },

    // Tenant Dashboard - Subscription Delete
    {
      pattern: `/${subroutes.metrics}/${subroutes.tenants}/:resourceName/:tenantId/${subroutes.subscription}/delete/:subscriptionId`,
      items: [
        { labelKey: 'breadcrumb:metrics', path: `/${subroutes.metrics}` },
        {
          labelKey: 'breadcrumb:tenants',
          path: `/${subroutes.metrics}/${subroutes.tenants}`,
        },
        {
          useSegmentAsLabel: true,
          path: `/${subroutes.metrics}/${subroutes.tenants}/:resourceName/:tenantId`,
        },
        {
          labelKey: 'breadcrumb:subscription',
          path: `/${subroutes.metrics}/${subroutes.tenants}/:resourceName/:tenantId/${subroutes.subscription}`,
        },
        { labelKey: 'breadcrumb:delete', hidden: true },
      ],
    },

    // Tenant Dashboard - Subscription
    {
      pattern: `/${subroutes.metrics}/${subroutes.tenants}/:resourceName/:tenantId/${subroutes.subscription}`,
      items: [
        { labelKey: 'breadcrumb:metrics', path: `/${subroutes.metrics}` },
        {
          labelKey: 'breadcrumb:tenants',
          path: `/${subroutes.metrics}/${subroutes.tenants}`,
        },
        {
          useSegmentAsLabel: true,
          path: `/${subroutes.metrics}/${subroutes.tenants}/:resourceName/:tenantId`,
        },
        { labelKey: 'breadcrumb:subscription' },
      ],
    },

    // Tenant Edit
    {
      pattern: `/${subroutes.metrics}/${subroutes.tenants}/:resourceName/:tenantId/${subroutes.edit}`,
      items: [
        { labelKey: 'breadcrumb:metrics', path: `/${subroutes.metrics}` },
        {
          labelKey: 'breadcrumb:tenants',
          path: `/${subroutes.metrics}/${subroutes.tenants}`,
        },
        {
          useSegmentAsLabel: true,
          path: `/${subroutes.metrics}/${subroutes.tenants}/:resourceName/:tenantId`,
        },
        { labelKey: 'breadcrumb:edit' },
      ],
    },

    // Tenant Creation (must be before Tenant Dashboard to match static 'creation' before dynamic :tenantId)
    {
      pattern: `/${subroutes.metrics}/${subroutes.tenants}/:resourceName/${subroutes.creation}`,
      items: [
        { labelKey: 'breadcrumb:metrics', path: `/${subroutes.metrics}` },
        {
          labelKey: 'breadcrumb:tenants',
          path: `/${subroutes.metrics}/${subroutes.tenants}`,
        },
        { labelKey: 'breadcrumb:creation' },
      ],
    },

    // Tenant Dashboard (General Information)
    {
      pattern: `/${subroutes.metrics}/${subroutes.tenants}/:resourceName/:tenantId`,
      items: [
        { labelKey: 'breadcrumb:metrics', path: `/${subroutes.metrics}` },
        {
          labelKey: 'breadcrumb:tenants',
          path: `/${subroutes.metrics}/${subroutes.tenants}`,
        },
        { useSegmentAsLabel: true },
      ],
    },

    // Tenant Delete Modal
    {
      pattern: `/${subroutes.metrics}/${subroutes.tenants}/delete/:tenantId`,
      items: [
        { labelKey: 'breadcrumb:metrics', path: `/${subroutes.metrics}` },
        {
          labelKey: 'breadcrumb:tenants',
          path: `/${subroutes.metrics}/${subroutes.tenants}`,
        },
      ],
    },

    // Tenants Listing
    {
      pattern: `/${subroutes.metrics}/${subroutes.tenants}`,
      items: [
        { labelKey: 'breadcrumb:metrics', path: `/${subroutes.metrics}` },
        { labelKey: 'breadcrumb:tenants' },
      ],
    },

    // Metrics root
    {
      pattern: `/${subroutes.metrics}`,
      items: [{ labelKey: 'breadcrumb:metrics' }],
    },

    // Service Edit
    {
      pattern: `/${subroutes.settings}/${subroutes.services}/${subroutes.edit}`,
      items: [
        { labelKey: 'breadcrumb:settings', path: `/${subroutes.settings}` },
        {
          labelKey: 'breadcrumb:services',
          path: `/${subroutes.settings}/${subroutes.services}`,
        },
        { labelKey: 'breadcrumb:edit' },
      ],
    },

    // Service Delete
    {
      pattern: `/${subroutes.settings}/${subroutes.services}/${subroutes.delete}`,
      items: [
        { labelKey: 'breadcrumb:settings', path: `/${subroutes.settings}` },
        {
          labelKey: 'breadcrumb:services',
          path: `/${subroutes.settings}/${subroutes.services}`,
        },
        { labelKey: 'breadcrumb:delete', hidden: true },
      ],
    },

    // Services Listing
    {
      pattern: `/${subroutes.settings}/${subroutes.services}`,
      items: [
        { labelKey: 'breadcrumb:settings', path: `/${subroutes.settings}` },
        { labelKey: 'breadcrumb:services' },
      ],
    },

    // Settings root
    {
      pattern: `/${subroutes.settings}`,
      items: [{ labelKey: 'breadcrumb:settings' }],
    },

    // Dashboards
    {
      pattern: `/${subroutes.dashboards}`,
      items: [{ labelKey: 'breadcrumb:dashboards' }],
    },
  ],

  fallbackToPathBased: true,
};

export default breadcrumbConfig;
