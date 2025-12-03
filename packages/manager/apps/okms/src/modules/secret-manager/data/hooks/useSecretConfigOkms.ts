import {
  getSecretConfigOkms,
  secretConfigOkmsQueryKey,
} from '@secret-manager/data/api/secretConfigOkms';
import { SecretConfig } from '@secret-manager/types/secret.type';
import { useQuery } from '@tanstack/react-query';

import { ErrorResponse } from '@/common/types/api.type';

export const useSecretConfigOkms = (okmsId: string) => {
  return useQuery<SecretConfig, ErrorResponse>({
    queryKey: secretConfigOkmsQueryKey(okmsId),
    queryFn: () => getSecretConfigOkms(okmsId),
  });
};
