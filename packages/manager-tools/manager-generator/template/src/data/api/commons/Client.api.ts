/**
 * Client.api.ts
 * -----------------------------------------------------------------------------
 * Typed facade over @ovh-ux/manager-core-api:
 *
 * - Provides generic JSON helpers (GET/POST/PUT/DELETE) abstracting v2/v6 clients.
 * - Exposes resilient onboarding fetcher (falls back to local config in mock mode).
 * - Offers single-page listing helpers (Iceberg v6, Iceberg v2, plain v6).
 *
 * For table rendering in UI, prefer the hook facade:
 *   `src/data/api/hooks/useResources.ts`
 */
import type { AxiosInstance } from 'axios';

import {
  type IcebergFetchResultV2,
  type IcebergFetchResultV6,
  fetchIcebergV2,
  fetchIcebergV6,
  v2 as httpV2,
  v6 as httpV6,
} from '@ovh-ux/manager-core-api';

import * as AppC from '@/App.constants';
import { ApiVersion, GetListingParams, JsonRequestOptions } from '@/types/ClientApi.type';
import { ListingPageResult } from '@/types/Listing.type';
import type { OnboardingConfigType } from '@/types/Onboarding.type';

import { ensureLeadingSlash, resolveListingRoute, resolveOnboardingRoute } from './Client.utils';

/** Internal, typed map of axios clients per API version. */
const API_CLIENTS: Record<ApiVersion, AxiosInstance> = {
  v2: httpV2,
  v6: httpV6,
};

/**
 * Return the axios client instance corresponding to the given API version.
 *
 * @param version - API version family (`'v2'` or `'v6'`).
 * @returns Axios client bound to the requested API family.
 *
 * @example
 * ```ts
 * const client = getApiClient('v6');
 * const { data } = await client.get('/me');
 * ```
 */
export function getApiClient(version: ApiVersion): AxiosInstance {
  return API_CLIENTS[version];
}

/**
 * Perform a JSON GET request against the selected API version.
 *
 * @typeParam T - Expected shape of the JSON response payload.
 * @param version - API version (`'v2'` or `'v6'`).
 * @param route - Absolute API route (e.g. `'/publicCloud/project'`).
 * @param options - Optional request parameters:
 *   - `params`: Query string parameters.
 *   - `headers`: Additional HTTP headers.
 *   - `disableCache`: When true, adds `Pragma: no-cache`.
 * @returns Parsed JSON response of type `T`.
 * @throws AxiosError if the request fails.
 *
 * @example
 * ```ts
 * const project = await getJSON<Project>('v6', '/cloud/project/123');
 * ```
 */
export async function getJSON<T>(
  version: ApiVersion,
  route: string,
  options: JsonRequestOptions = {},
): Promise<T> {
  const client = getApiClient(version);
  const headers = {
    ...(options.headers ?? {}),
    ...(options.disableCache ? { Pragma: 'no-cache' } : {}),
  };
  const { data } = await client.get<T>(route, { params: options.params, headers });
  return data;
}

/**
 * Perform a JSON POST request against the selected API version.
 *
 * @typeParam T - Expected shape of the JSON response payload.
 * @param version - API version (`'v2'` or `'v6'`).
 * @param route - Absolute API route.
 * @param body - Request body to send (any serializable value).
 * @param options - Optional request parameters (headers, params, disableCache).
 * @returns Parsed JSON response of type `T`.
 * @throws AxiosError if the request fails.
 *
 * @example
 * ```ts
 * const res = await postJSON<Result>('v6', '/cloud/project', { name: 'test' });
 * ```
 */
export async function postJSON<T>(
  version: ApiVersion,
  route: string,
  body?: unknown,
  options: JsonRequestOptions = {},
): Promise<T> {
  const client = getApiClient(version);
  const headers = {
    ...(options.headers ?? {}),
    ...(options.disableCache ? { Pragma: 'no-cache' } : {}),
  };
  const { data } = await client.post<T>(route, body, { params: options.params, headers });
  return data;
}

/**
 * Perform a JSON PUT request against the selected API version.
 *
 * @typeParam T - Expected shape of the JSON response payload.
 * @param version - API version (`'v2'` or `'v6'`).
 * @param route - Absolute API route.
 * @param body - Request body to update (any serializable value).
 * @param options - Optional request parameters (headers, params, disableCache).
 * @returns Parsed JSON response of type `T`.
 * @throws AxiosError if the request fails.
 *
 * @example
 * ```ts
 * const updated = await putJSON<User>('v6', '/me', { firstName: 'Alice' });
 * ```
 */
export async function putJSON<T>(
  version: ApiVersion,
  route: string,
  body?: unknown,
  options: JsonRequestOptions = {},
): Promise<T> {
  const client = getApiClient(version);
  const headers = {
    ...(options.headers ?? {}),
    ...(options.disableCache ? { Pragma: 'no-cache' } : {}),
  };
  const { data } = await client.put<T>(route, body, { params: options.params, headers });
  return data;
}

/**
 * Perform a JSON DELETE request against the selected API version.
 *
 * @typeParam T - Expected shape of the JSON response payload.
 * @param version - API version (`'v2'` or `'v6'`).
 * @param route - Absolute API route.
 * @param options - Optional request parameters (headers, params, disableCache).
 * @returns Parsed JSON response of type `T`.
 * @throws AxiosError if the request fails.
 *
 * @example
 * ```ts
 * await deleteJSON<void>('v6', '/cloud/project/123');
 * ```
 */
export async function deleteJSON<T>(
  version: ApiVersion,
  route: string,
  options: JsonRequestOptions = {},
): Promise<T> {
  const client = getApiClient(version);
  const headers = {
    ...(options.headers ?? {}),
    ...(options.disableCache ? { Pragma: 'no-cache' } : {}),
  };
  const { data } = await client.delete<T>(route, { params: options.params, headers });
  return data;
}

/**
 * Fetch onboarding configuration.
 *
 * - In `mock` mode, or when no API route is defined, returns the local
 *   `ONBOARDING_CONFIG` constant to keep UI functional.
 * - Otherwise, performs a backend fetch with graceful fallback on error.
 *
 * @param params - Optional path params to interpolate into the route
 *   (e.g. `{ domain: 'example.com' }`).
 * @returns Onboarding configuration object.
 *
 * @example
 * ```ts
 * const config = await getOnboardingConfig({ domain: 'myapp' });
 * ```
 */
export async function getOnboardingConfig(
  params?: Record<string, string | number>,
): Promise<OnboardingConfigType> {
  if (AppC.API_DATA_MODE === 'mock') {
    return AppC.ONBOARDING_CONFIG;
  }

  const route = resolveOnboardingRoute(params);
  if (!route) {
    return AppC.ONBOARDING_CONFIG;
  }

  try {
    return await getJSON<OnboardingConfigType>(AppC.APP_FEATURES?.onboardingApi, route);
  } catch {
    return AppC.ONBOARDING_CONFIG;
  }
}

/**
 * Fetch a single page via Iceberg v6.
 *
 * @typeParam T - Resource item type.
 * @param route - Absolute API route.
 * @param params - Listing parameters: page, pageSize, sort, filters.
 * @returns Normalized listing page result.
 */
async function fetchListingV6Iceberg<T>(
  route: string,
  { page = 1, pageSize = 20, sortBy, sortDesc, filters = [] }: GetListingParams,
): Promise<ListingPageResult<T>> {
  const res: IcebergFetchResultV6<T> = await fetchIcebergV6<T>({
    route,
    page,
    pageSize,
    sortBy,
    sortReverse: !!sortDesc,
    filters,
  });
  return {
    data: res.data,
    totalCount: res.totalCount,
    status: res.status,
  };
}

/**
 * Fetch a single page via Iceberg v2 (cursor strategy).
 *
 * @typeParam T - Resource item type.
 * @param route - Absolute API route.
 * @param params - Listing parameters: pageSize, sort, filters, cursor.
 * @returns Normalized listing page result with `cursorNext`.
 */
async function fetchListingV2Iceberg<T>(
  route: string,
  { pageSize = 20, sortBy, sortDesc, filters = [], cursor }: GetListingParams,
): Promise<ListingPageResult<T>> {
  const res: IcebergFetchResultV2<T> = await fetchIcebergV2<T>({
    route,
    pageSize,
    sortBy,
    sortOrder: sortDesc ? 'DESC' : 'ASC',
    filters,
    cursor,
  });
  return {
    data: res.data,
    totalCount: Number.POSITIVE_INFINITY,
    cursorNext: res.cursorNext,
    status: res.status,
  };
}

/**
 * Fetch whole list via plain v6 (no Iceberg headers).
 *
 * @typeParam T - Resource item type.
 * @param route - Absolute API route.
 * @returns Entire list with computed `totalCount`.
 */
async function fetchListingPlainV6<T>(route: string): Promise<ListingPageResult<T>> {
  const data = await getJSON<T[]>('v6', route);
  return { data, totalCount: Array.isArray(data) ? data.length : 0, status: 200 };
}

/**
 * Fetch a single listing "page" using the configured strategy:
 *
 * - `APP_FEATURES.listingApi === 'v6Iceberg'` → Iceberg v6 page.
 * - `APP_FEATURES.listingApi === 'v2'`        → Iceberg v2 page (cursor-based).
 * - Otherwise                                 → Plain v6 list.
 *
 * In mock mode, returns `LISTING_PLACEHOLDER_ITEMS` truncated to `pageSize`.
 *
 * @typeParam T - Resource item type (e.g. `Project`, `Domain`).
 * @param params - Listing parameters:
 *   - `route`: API route override.
 *   - `page`, `pageSize`: Pagination config.
 *   - `sortBy`, `sortDesc`: Sorting options.
 *   - `filters`: Iceberg filter descriptors.
 *   - `cursor`: Cursor token (v2 strategy).
 * @returns Normalized listing page result.
 *
 * @example
 * ```ts
 * const { data, totalCount } = await getListingPage<Project>({
 *   page: 1,
 *   pageSize: 50,
 *   sortBy: 'creationDate',
 *   sortDesc: true,
 * });
 * ```
 */
export async function getListingPage<T = unknown>(
  params: GetListingParams = {},
): Promise<ListingPageResult<T>> {
  const route = ensureLeadingSlash(params.route ?? resolveListingRoute());
  const apiChoice = AppC.APP_FEATURES?.listingApi;

  if (apiChoice === 'v6Iceberg') {
    return fetchListingV6Iceberg<T>(route, params);
  }
  if (apiChoice === 'v2') {
    return fetchListingV2Iceberg<T>(route, params);
  }
  return fetchListingPlainV6<T>(route);
}
