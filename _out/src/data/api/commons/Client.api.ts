import { APP_FEATURES, LISTING_PLACEHOLDER_ITEMS, ONBOARDING_CONFIG } from '@/App.constants';

/**
 * ---------------------------------------------------------------------------
 *  FLAVOR → API CONFIGURATION MAPPING
 * ---------------------------------------------------------------------------
 *  This table shows typical defaults for each app flavor.
 *
 *  Flavor   | onboardingApi | listingApi     | Example Routes
 *  ---------|---------------|----------------|---------------------------------
 *  PCI      | 'v2'          | 'v6Iceberg'    | /cloud/project/{projectId}/...
 *  Zimbra   | 'v6'          | 'v6Iceberg'    | /email/pro/{serviceName}/...
 *  Hub      | 'v2'          | 'v2'           | /hub/services
 *  Web      | 'v2'          | 'v6Iceberg'    | /hosting/web/{serviceName}/...
 *
 * ---------------------------------------------------------------------------
 */

/**
 * Supported data modes for the client.
 * - `mock`: Use local/static mock data (no HTTP calls).
 * - `live`: Call real backend endpoints based on APP_FEATURES API flavor.
 */
export type DataMode = 'mock' | 'live';

/**
 * Shape of the API client.
 */
export interface Client {
  /**
   * Fetch onboarding configuration.
   * - **`APP_FEATURES.onboardingApi = 'v2'`** → Calls `v2.get('/onboarding/config')`
   * - **`APP_FEATURES.onboardingApi = 'v6'`** → Calls `v6.get('/onboarding/config')`
   * - In `mock` mode → Returns static `ONBOARDING_CONFIG`
   */
  getOnboardingConfig<T>(): Promise<T>;

  /**
   * Fetch a paginated service listing.
   * - **`APP_FEATURES.listingApi = 'v6Iceberg'`** → Calls Iceberg v6 with `{ page, pageSize }`
   * - **`APP_FEATURES.listingApi = 'v2'`** → Calls v2 REST with pagination params
   * - In `mock` mode → Returns sliced `LISTING_PLACEHOLDER_ITEMS`
   */
  getListing<T>(opts: {
    route: string;
    page: number;
    pageSize: number;
  }): Promise<{ data: T[]; status: number; totalCount: number }>;
}

/**
 * Centralized mock payloads for V2 endpoints.
 */
const MOCK_V2: Record<string, unknown> = {
  '/onboarding/config': ONBOARDING_CONFIG,
};

// eslint-disable-next-line max-lines-per-function
export const makeClient = ({ dataMode }: { dataMode: DataMode }): Client => {
  const isMock = dataMode === 'mock';

  /**
   * GET wrapper for v2 endpoints.
   *
   * **Live example (v2):**
   * ```ts
   * import { v2 } from '@ovh-ux/manager-core-api';
   * const { data } = await v2.get<T>('/onboarding/config');
   * return data;
   * ```
   */
  const v2Get = <T>(path: string): Promise<T> => {
    if (isMock) {
      return Promise.resolve((MOCK_V2[path] ?? {}) as T);
    }
    return Promise.reject<T>(new Error('v2 live not yet wired'));
  };

  /**
   * GET wrapper for v6 Iceberg endpoints (paginated listings).
   *
   * **Live example (Iceberg v6):**
   * ```ts
   * import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
   * const { data, status, totalCount } = await fetchIcebergV6<T>({
   *   route: '/cloud/project/{projectId}/instances',
   *   page: 1,
   *   pageSize: 25
   * });
   * return { data, status, totalCount };
   * ```
   */
  const v6Iceberg = <T>({
    route,
    page,
    pageSize,
  }: {
    route: string;
    page: number;
    pageSize: number;
  }): Promise<{ data: T[]; status: number; totalCount: number }> => {
    if (isMock) {
      const start = (page - 1) * pageSize;
      const slice = LISTING_PLACEHOLDER_ITEMS.slice(start, start + pageSize) as T[];
      void route; // unused in mock mode
      return Promise.resolve({
        data: slice,
        status: 200,
        totalCount: LISTING_PLACEHOLDER_ITEMS.length,
      });
    }
    return Promise.reject(new Error('v6 iceberg live not yet wired'));
  };

  return {
    getOnboardingConfig<T>() {
      if (APP_FEATURES.onboardingApi === 'v2') {
        /**
         * **Live v2 onboarding config example:**
         * ```ts
         * import { v2 } from '@ovh-ux/manager-core-api';
         * const { data } = await v2.get<T>('/onboarding/config');
         * return data;
         * ```
         */
        return v2Get<T>('/onboarding/config');
      }
      if (APP_FEATURES.onboardingApi === 'v6') {
        /**
         * **Live v6 onboarding config example:**
         * ```ts
         * import { v6 } from '@ovh-ux/manager-core-api';
         * const { data } = await v6.get<T>('/onboarding/config');
         * return data;
         * ```
         */
        return Promise.reject<T>(new Error('v6 onboarding config not yet implemented'));
      }
      return Promise.reject<T>(
        new Error(`Unsupported onboardingApi: ${APP_FEATURES.onboardingApi as string}`),
      );
    },

    getListing<T>(opts: { route: string; page: number; pageSize: number }) {
      if (APP_FEATURES.listingApi === 'v6Iceberg') {
        return v6Iceberg<T>(opts);
      }
      if (APP_FEATURES.listingApi === 'v2') {
        /**
         * **Live v2 listing example:**
         * ```ts
         * import { v2 } from '@ovh-ux/manager-core-api';
         * const { data } = await v2.get<T[]>(opts.route, {
         *   params: { page: opts.page, pageSize: opts.pageSize }
         * });
         * return { data, status: 200, totalCount: data.length };
         * ```
         */
        return Promise.reject(new Error('v2 listing not yet implemented'));
      }
      return Promise.reject(
        new Error(`Unsupported listingApi: ${APP_FEATURES.listingApi as string}`),
      );
    },
  };
};
