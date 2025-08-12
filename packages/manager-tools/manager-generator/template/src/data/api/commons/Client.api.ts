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
 * Execution mode for the client.
 *
 * - `"mock"` — uses local/static payloads, performs **no HTTP** calls. Intended for tests
 *   and local dev. In this mode:
 *   - `getOnboardingConfig()` always returns `ONBOARDING_CONFIG` regardless of API family.
 *   - `getListing()` returns a paginated slice of `LISTING_PLACEHOLDER_ITEMS`.
 * - `"live"` — performs real HTTP calls (only once wired; some branches may reject until then).
 */
export type DataMode = 'mock' | 'live';

/**
 * Strongly-typed surface of the generated API client.
 */
export interface Client {
  /**
   * Fetches the onboarding configuration for the app.
   *
   * Behavior by mode:
   * - **mock**: returns `ONBOARDING_CONFIG`.
   * - **live**: dispatches to the API family configured via `APP_FEATURES.onboardingApi`.
   *
   * @typeParam T - Expected payload shape (defaults to the inferred `ONBOARDING_CONFIG` type when used without a generic).
   * @returns A promise resolving to the onboarding configuration.
   *
   * @example
   * ```ts
   * const client = makeClient({ dataMode: 'mock' });
   * const cfg = await client.getOnboardingConfig();
   * ```
   */
  getOnboardingConfig<T>(): Promise<T>;

  /**
   * Fetches a paginated listing.
   *
   * Behavior by mode:
   * - **mock**: returns a slice from `LISTING_PLACEHOLDER_ITEMS` ({@link page}, {@link pageSize}).
   * - **live**: dispatches to the API family configured via `APP_FEATURES.listingApi`.
   *
   * @typeParam T - Row type for the listing.
   * @param opts - Listing request options.
   * @param opts.route - API route (e.g., `/cloud/project/{projectId}/instances`).
   * @param opts.page - 1-based page index.
   * @param opts.pageSize - number of items per page.
   * @returns A promise resolving to `{ data, status, totalCount }`.
   *
   * @example
   * ```ts
   * const client = makeClient({ dataMode: 'mock' });
   * const { data, totalCount } = await client.getListing<{ id: string }>({
   *   route: '/cloud/project/{projectId}/instances',
   *   page: 1,
   *   pageSize: 25,
   * });
   * ```
   */
  getListing<T>(opts: {
    route: string;
    page: number;
    pageSize: number;
  }): Promise<{ data: T[]; status: number; totalCount: number }>;
}

/**
 * Centralized mock payloads for v2 endpoints, keyed by route path.
 * Extend as new mocked v2 endpoints are needed.
 *
 * @internal
 */
const MOCK_V2: Record<string, unknown> = {
  '/onboarding/config': ONBOARDING_CONFIG,
};

/**
 * Factory to create a client bound to a given {@link DataMode}.
 *
 * - In `"mock"` mode, the client does **not** perform network calls.
 * - In `"live"` mode, only the branches documented as “wired” will call the network;
 *   others reject with a clear error until implemented.
 *
 * @param options - Factory options.
 * @param options.dataMode - Execution mode: `"mock"` or `"live"`.
 * @returns A {@link Client} instance.
 *
 * @example
 * ```ts
 * const client = makeClient({ dataMode: 'mock' });
 * const onboarding = await client.getOnboardingConfig();
 * const page1 = await client.getListing<{ id: string; name: string }>({
 *   route: '/cloud/project/{projectId}/instances',
 *   page: 1,
 *   pageSize: 20,
 * });
 * ```
 */
// eslint-disable-next-line max-lines-per-function
export const makeClient = ({ dataMode }: { dataMode: DataMode }): Client => {
  const isMock = dataMode === 'mock';

  /**
   * Lightweight GET helper for v2 endpoints.
   *
   * @typeParam T - Expected response payload.
   * @param path - v2 route path (e.g. `'/onboarding/config'`).
   * @returns A promise resolving to the mocked payload in mock mode; rejects in live until wired.
   * @internal
   */
  const v2Get = <T>(path: string): Promise<T> => {
    if (isMock) {
      return Promise.resolve((MOCK_V2[path] ?? {}) as T);
    }
    return Promise.reject<T>(new Error('v2 live not yet wired'));
  };

  /**
   * Lightweight helper for Iceberg v6 listings.
   *
   * @typeParam T - Row type for the listing.
   * @param params - Listing parameters.
   * @param params.route - API route (unused in mock mode).
   * @param params.page - 1-based page index.
   * @param params.pageSize - number of items per page.
   * @returns In mock mode, a paginated slice of `LISTING_PLACEHOLDER_ITEMS`; rejects in live until wired.
   * @internal
   *
   * @example
   * ```ts
   * // mock result shape
   * const { data, status, totalCount } = await v6Iceberg<{ id: string }>({
   *   route: '/cloud/project/{projectId}/instances',
   *   page: 1,
   *   pageSize: 25,
   * });
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
    /**
     * See {@link Client.getOnboardingConfig | getOnboardingConfig} on the interface for behavior.
     */
    getOnboardingConfig<T>() {
      // Mock short-circuit for both v2 and v6
      if (isMock) return Promise.resolve(ONBOARDING_CONFIG as T);

      if (APP_FEATURES.onboardingApi === 'v2') {
        // Example of live wiring (kept in comments until available):
        // const { data } = await v2.get<T>('/onboarding/config');
        // return data;
        return v2Get<T>('/onboarding/config');
      }
      if (APP_FEATURES.onboardingApi === 'v6') {
        // Example of live wiring (kept in comments until available):
        // const { data } = await v6.get<T>('/onboarding/config');
        // return data;
        return Promise.reject<T>(new Error('v6 onboarding config not yet implemented'));
      }
      return Promise.reject<T>(
        new Error(`Unsupported onboardingApi: ${APP_FEATURES.onboardingApi as string}`),
      );
    },

    /**
     * See {@link Client.getListing | getListing} on the interface for behavior and result shape.
     */
    getListing<T>(opts: { route: string; page: number; pageSize: number }) {
      /** Mock short-circuit for any listingApi */
      if (isMock) {
        const { page, pageSize } = opts;
        const start = (page - 1) * pageSize;
        const data = LISTING_PLACEHOLDER_ITEMS.slice(start, start + pageSize) as T[];
        return Promise.resolve({
          data,
          status: 200,
          totalCount: LISTING_PLACEHOLDER_ITEMS.length,
        });
      }

      if (APP_FEATURES.listingApi === 'v6Iceberg') {
        return v6Iceberg<T>(opts);
      }
      if (APP_FEATURES.listingApi === 'v2') {
        // Example of live wiring (kept in comments until available):
        // const { data } = await v2.get<T[]>(opts.route, { params: { page, pageSize } });
        // return { data, status: 200, totalCount: data.length };
        return Promise.reject(new Error('v2 listing not yet implemented'));
      }
      return Promise.reject(
        new Error(`Unsupported listingApi: ${APP_FEATURES.listingApi as string}`),
      );
    },
  };
};
