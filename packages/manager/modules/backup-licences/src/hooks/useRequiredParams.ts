import { useParams } from 'react-router-dom';

import { invariant } from '@/utils/invariant';

/**
 * A hook that ensures specific params exist in the URL.
 * Usage: const { id } = useRequiredParams('id');
 */
export function useRequiredParams<Key extends string>(...keys: Key[]): Record<Key, string> {
  const params = useParams();
  // Loop over the keys you requested and check them
  keys.forEach((key) => {
    invariant(params[key], `Missing required param "${key} in the URL"`);
  });
  // If we pass the checks, we force the type to match the keys provided
  return params as Record<Key, string>;
}
