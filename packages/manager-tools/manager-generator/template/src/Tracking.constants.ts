import { APP_FEATURES, appName } from '@/App.constants';

/**
 * Tracking Level 2 codes per region.
 *
 * Values are dynamically read from {@link APP_FEATURES.tracking.level2ByRegion}
 * so they can adapt to different app flavors without editing this file.
 *
 * Example:
 * - EU region will use `APP_FEATURES.tracking.level2ByRegion.EU.level2`
 * - CA region will use `APP_FEATURES.tracking.level2ByRegion.CA.level2`
 * - US region will use `APP_FEATURES.tracking.level2ByRegion.US.level2`
 */
export const LEVEL2 = {
  EU: { config: { level2: APP_FEATURES.tracking.level2ByRegion.EU.level2 } },
  CA: { config: { level2: APP_FEATURES.tracking.level2ByRegion.CA.level2 } },
  US: { config: { level2: APP_FEATURES.tracking.level2ByRegion.US.level2 } },
} as const;

/**
 * High-level product taxonomy for tracking and analytics.
 *
 * These values are flavor-driven:
 * - `UNIVERSE` represents the top-level business unit or product family.
 * - `SUB_UNIVERSE` represents a subcategory within that universe.
 *
 * Both are sourced from {@link APP_FEATURES.tracking} to ensure they
 * can be overridden per app flavor via `App.constants.ts`.
 */
export const UNIVERSE = APP_FEATURES.tracking.universe;
export const SUB_UNIVERSE = APP_FEATURES.tracking.subUniverse;

/**
 * Canonical application name for tracking purposes.
 *
 * Defaults to the global {@link appName} unless overridden
 * by `APP_FEATURES.tracking.appNameForTracking` in `App.constants.ts`.
 *
 * This value is used in analytics, tagging, and telemetry to
 * consistently identify the application across environments.
 */
export const APP_NAME = APP_FEATURES.tracking.appNameForTracking ?? appName;
