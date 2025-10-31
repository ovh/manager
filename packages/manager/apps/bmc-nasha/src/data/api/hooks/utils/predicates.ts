import type { Query, QueryKey } from '@tanstack/react-query';
import { nashaQueryKey } from './queryKeys';

/**
 * Predicate to match all Nasha service queries
 * Useful for batch operations on cache (invalidation, removal, etc.)
 */
export function nashaServicesQueryPredicate(query: Query): boolean {
  const queryKey = query.queryKey;
  return (
    Array.isArray(queryKey) &&
    queryKey.length > 0 &&
    queryKey[0] === 'nasha-services'
  );
}

/**
 * Predicate to match queries for a specific service
 * @param serviceName - The service name to filter by
 */
export function nashaServiceQueryPredicate(
  serviceName: string,
): (query: Query) => boolean {
  return (query: Query): boolean => {
    const queryKey = query.queryKey;
    return (
      Array.isArray(queryKey) &&
      queryKey.length > 1 &&
      queryKey[0] === 'nasha-services' &&
      queryKey[1] === serviceName
    );
  };
}

/**
 * Helper to check if a query key matches the nasha services pattern
 */
export function isNashaServicesQueryKey(queryKey: QueryKey): boolean {
  return (
    Array.isArray(queryKey) &&
    queryKey.length > 0 &&
    queryKey[0] === 'nasha-services'
  );
}

