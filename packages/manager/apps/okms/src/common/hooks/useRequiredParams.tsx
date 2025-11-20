import { useParams } from 'react-router-dom';

import { KMS_URL_PARAMS } from '@key-management-service/routes/routes.constants';
import { SECRET_MANAGER_URL_PARAMS } from '@secret-manager/routes/routes.constants';

import { invariant } from '@/common/utils/tools/invariant';

type UrlParam = keyof typeof KMS_URL_PARAMS | keyof typeof SECRET_MANAGER_URL_PARAMS;

/**
 * A hook that ensures specific params exist in the URL.
 * Usage: const { id } = useRequiredParams('id');
 */
export function useRequiredParams<Key extends UrlParam>(...keys: Key[]): Record<Key, string> {
  const params = useParams();

  // Loop over the keys you requested and check them
  keys.forEach((key) => {
    invariant(params[key], `Missing required param "${key} in the URL"`);
  });

  // If we pass the checks, we force the type to match the keys provided
  return params as Record<Key, string>;
}
