import type { OnboardingConfigType } from '@/types/Onboarding.type';

import type { ListingItemType } from './types/Listing.type';

/** Short, unique identifier for the app (used in tracking, tagging, etc.). */
export const appName = 'strip-version-test';

/**
 * Global application configuration for constants and static data.
 */
export const AppConfig = {
  listing: {
    datagrid: {
      /** Service key used by the listing datagrid. */
      serviceKey: 'v6-domain',
    },
  },
  /** Display label for the root navigation context. */
  rootLabel: appName,
} as const;

/**
 * Default onboarding configuration.
 * This mock is used until the backend endpoint `/onboarding/config` is available.
 */
export const ONBOARDING_CONFIG: OnboardingConfigType = {
  productName: 'Strip-Version-Test',
  productCategory: 'Public Cloud',
  brand: 'OVHcloud',
  // heroImage: { src: '/assets/assets/hero.png' },
  tiles: [
    { id: 1, key: 'guide1', linkKey: 'discover' },
    { id: 2, key: 'guide2', linkKey: 'tutorial' },
    { id: 3, key: 'guide3', linkKey: 'faq' },
  ],
  links: {
    discover: '#',
    tutorial: '#',
    faq: '#',
  },
};

/**
 * Static placeholder list of services for local/mock mode.
 */
export const LISTING_PLACEHOLDER_ITEMS: ReadonlyArray<ListingItemType> = Object.freeze([
  // Keep as static mock list — generator usually won’t change this
  { id: '1', name: 'Alpha Service', status: 'active' },
  { id: '2', name: 'Beta Compute Node', status: 'pending' },
  { id: '3', name: 'Gamma Storage Volume', status: 'active' },
  { id: '4', name: 'Delta Backup', status: 'suspended' },
  { id: '5', name: 'Epsilon Database', status: 'error' },
  { id: '6', name: 'Zeta Network Interface', status: 'active' },
  { id: '7', name: 'Eta Firewall', status: 'pending' },
  { id: '8', name: 'Theta Load Balancer', status: 'active' },
  { id: '9', name: 'Iota API Gateway', status: 'archived' },
  { id: '10', name: 'Kappa DNS Zone', status: 'active' },
  { id: '11', name: 'Lambda Email Service', status: 'active' },
  { id: '12', name: 'Mu Logging Endpoint', status: 'suspended' },
  { id: '13', name: 'Nu Object Storage', status: 'pending' },
  { id: '14', name: 'Xi Monitoring Agent', status: 'error' },
  { id: '15', name: 'Omicron VPN Tunnel', status: 'active' },
  { id: '16', name: 'Pi Analytics Pipeline', status: 'active' },
  { id: '17', name: 'Rho Message Queue', status: 'archived' },
  { id: '18', name: 'Sigma Edge Device', status: 'pending' },
  { id: '19', name: 'Tau Development Workspace', status: 'active' },
  { id: '20', name: 'Upsilon Cache Cluster', status: 'active' },
]);

/**
 * Application enabled features and routing shape configuration.
 * Change these per flavor; everything else computes from here.
 */
export const APP_FEATURES = {
  listingApi: 'v6Iceberg', // 'v6Iceberg' | 'v2' | 'v6'
  onboardingApi: 'v6', // 'v2' | 'v6'
  isPci: false, // true | false

  /**
   * 'pci'           -> /<basePrefix>/pci/projects/:projectId/<appSlug>
   * 'generic'       -> /<basePrefix>/<appSlug>
   * 'platformParam' -> /<basePrefix>/:platformId
   */
  routeFlavor: 'generic',

  /** Optional prefix before the flavor path (shell namespace) */
  basePrefix: '',

  serviceParam: 'serviceId',
  platformParam: 'platformId',
  appSlug: 'strip-version-test',

  // tracking knobs (generator sets these per flavor)
  tracking: {
    // LEVEL2 differs by region and product line
    level2ByRegion: {
      EU: { level2: '120' },
      CA: { level2: '120' },
      US: { level2: '120' },
    } as const,

    // UNIVERSE/SUB_UNIVERSE differ by flavor/product
    universe: 'Manager' as const,
    subUniverse: 'Manager' as const,

    // app “name” for tracker (mirror appName by default)
    appNameForTracking: appName,
  },
} as const;
