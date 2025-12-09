import { SecretConfigReference } from '@secret-manager/types/secret.type';
import { skipToken, useQuery } from '@tanstack/react-query';

import { ErrorResponse } from '@/common/types/api.type';
import {
  getSecretConfigReference,
  secretReferenceQueryKeys,
} from '@/modules/secret-manager/data/api/secretReference';

export const useSecretConfigReference = (regionId: string | undefined) => {
  return useQuery<SecretConfigReference, ErrorResponse>({
    queryKey: secretReferenceQueryKeys.config(regionId || 'disabled'),
    queryFn: regionId ? () => getSecretConfigReference(regionId) : skipToken,
  });
};
