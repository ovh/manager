/**
 * template/src/App.constants.ts
 *
 * Centralized constants for the generated app:
 * - App identity & static UI config
 * - API endpoints + data mode
 * - Onboarding mock data
 * - Listing placeholder data (mock mode)
 * - Feature flags & routing shape (APP_FEATURES)
 *
 * Notes:
 * - Tokens like {{appSlug}}, {{mainApiPath}}, etc. are replaced at generation time.
 * - For PCI, {{appSlug}} is expected to be the short slug (e.g., "test" for "app-pci-test").
 */
import type { OnboardingConfigType } from '@/types/Onboarding.type';

/**
 * Application identifier (injected by generator).
 *
 * @remarks
 * Used across routing, tracking, and display.
 */
export const appName = '{{appNameKebab}}';

/**
 * Static application-level configuration.
 *
 * @remarks
 * Includes labels and UI defaults, independent of feature flags.
 */
export const AppConfig = {
  listing: {
    datagrid: {
      /** Service key used by Datagrid (injected at generation). */
      serviceKey: '{{serviceKey}}',
    },
  },
  /** Display label for the root navigation context. */
  rootLabel: appName,
} as const;

/**
 * Default API data mode for this app.
 *
 * - `'live'`: Network calls to real API endpoints.
 * - `'mock'`: Local placeholder data from constants (offline/dev mode).
 */
export const API_DATA_MODE: 'live' | 'mock' = 'live';

const docUrl = 'https://docs.ovh.com';

/**
 * Default onboarding configuration for mock or fallback mode.
 *
 * @remarks
 * Provides product identity, brand, category, hero image (optional),
 * onboarding tiles, and guide links.
 */
export const ONBOARDING_CONFIG: OnboardingConfigType = {
  productName: '{{appNameKebab}}',
  productCategory: 'Public Cloud',
  brand: 'OVHcloud',
  // Example hero:
  // heroImage: { src: '/assets/assets/hero.png' },
  tiles: [
    { id: 1, key: 'guide1', linkKey: 'discover' },
    { id: 2, key: 'guide2', linkKey: 'tutorial' },
    { id: 3, key: 'guide3', linkKey: 'faq' },
  ],
  links: {
    discover: docUrl,
    tutorial: docUrl,
    faq: docUrl,
  },
};

/** API family selection types for generated code. */
export type ListingApi = 'v6Iceberg' | 'v6' | 'v2';
export type OnboardingApi = 'v6' | 'v2';

/**
 * API routes used by onboarding and listing fetchers.
 *
 * @remarks
 * - `ONBOARDING_API_ROUTE`: Resolved with `{domain}` param.
 * - `LISTING_API_ROUTE`: Root for listing requests.
 */
export const ONBOARDING_API_ROUTE = '{{onboardingEndpoint}}';
export const LISTING_API_ROUTE = '{{listingEndpoint}}';

/**
 * Feature flags & routing configuration for this app.
 *
 * @remarks
 * Drives the runtime behavior of routing, API selection, and tracking.
 *
 * Keys:
 * - `isPci`: Toggles PCI flavor behaviors.
 * - `routeFlavor`: Determines how root path is computed:
 *   - `'pci'`           → `/[basePrefix]/pci/projects/:projectId/<appSlug>`
 *   - `'generic'`       → `/[basePrefix]/<appSlug>`
 *   - `'platformParam'` → `/[basePrefix]/:platformId`
 * - `basePrefix`: Optional prefix before the flavor path (defaults to auto-detect).
 * - `serviceParam` / `platformParam`: Route parameters (without `:`; normalized at runtime).
 * - `appSlug`: Slug segment after the flavor root. For PCI, must be the short slug.
 * - `tracking`: Configuration for analytics (region → level2, universe, subUniverse).
 */
export const APP_FEATURES = {
  /** Listing API family to use (v6 Iceberg, v6, or v2). */
  listingApi: '{{listingApi}}' as ListingApi,

  /** Onboarding API family to use (v6 or v2). */
  onboardingApi: '{{onboardingApi}}' as OnboardingApi,

  /** Enable PCI flavor behavior. */
  isPci: '{{isPci}}',

  /** Route flavor for computing root path. */
  routeFlavor: '{{routeFlavor}}' as const, // 'pci' | 'generic' | 'platformParam'

  /** Optional prefix before the flavor path (shell namespace). Leave empty for auto-detect. */
  basePrefix: '{{basePrefix}}',

  /** Route param name for services (without `:`). */
  serviceParam: '{{serviceParam}}',

  /** Route param name for platform (without `:`). */
  platformParam: '{{platformParam}}',

  /** Slug segment used after the flavor root (short slug for PCI). */
  appSlug: '{{appSlug}}',

  /** Tracking/analytics configuration. */
  tracking: {
    /** Level2 tracking identifiers by region. */
    level2ByRegion: {
      EU: { level2: '{{trackingLevel2}}' },
      CA: { level2: '{{trackingLevel2}}' },
      US: { level2: '{{trackingLevel2}}' },
    } as const,
    /** Analytics universe label. */
    universe: '{{trackingUniverse}}' as const,
    /** Analytics sub-universe label. */
    subUniverse: '{{trackingSubUniverse}}' as const,
    /** Application name used in tracking. */
    appNameForTracking: appName,
  },
} as const;
