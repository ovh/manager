import type { QueryKey } from '@tanstack/react-query';

/**
 * Factory function to create structured query keys for Nasha services
 * @param parts - Additional parts to append to the base key
 * @returns Structured query key array
 */
export function nashaQueryKey(parts: (string | number)[]): QueryKey {
  return ['nasha-services', ...parts];
}

/**
 * Create query key for a specific Nasha service
 * @param serviceName - The service name
 * @param parts - Additional parts to append
 * @returns Structured query key for a service
 */
export function nashaServiceQueryKey(
  serviceName: string,
  parts: (string | number)[] = [],
): QueryKey {
  return ['nasha-services', serviceName, ...parts];
}

/**
 * Create query key for Nasha partitions
 * @param serviceName - The service name
 * @param partitionName - Optional partition name
 * @param parts - Additional parts to append
 * @returns Structured query key for partitions
 */
export function nashaPartitionQueryKey(
  serviceName: string,
  partitionName?: string,
  parts: (string | number)[] = [],
): QueryKey {
  const base = ['nasha-services', serviceName, 'partitions'];
  if (partitionName) {
    base.push(partitionName);
  }
  return [...base, ...parts];
}

