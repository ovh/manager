import { useQuery } from '@tanstack/react-query';
import { Secret, SecretWithData } from '@secret-manager/types/secret.type';
import { ErrorResponse } from '@/types/api.type';
import {
  getSecret,
  getSecretWithData,
  secretQueryKeys,
} from '@/modules/secret-manager/data/api/secrets';

export const useSecret = (okmsId: string, secretPath: string) => {
  return useQuery<Secret, ErrorResponse>({
    queryKey: secretQueryKeys.detail(okmsId, secretPath),
    queryFn: () => getSecret(okmsId, secretPath),
  });
};

export const useSecretWithData = (okmsId: string, secretPath: string) => {
  return useQuery<SecretWithData, ErrorResponse>({
    queryKey: secretQueryKeys.detailWithData(okmsId, secretPath),
    queryFn: () => getSecretWithData(okmsId, secretPath),
    gcTime: 0,
  });
};
