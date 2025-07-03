import { useQuery } from '@tanstack/react-query';
import { Secret } from '@secret-manager/types/secret.type';
import { ErrorResponse } from '@/types/api.type';
import {
  getSecret,
  secretQueryKeys,
} from '@/modules/secret-manager/data/api/secrets';

export const useSecret = (okmsId: string, secretPath: string) => {
  return useQuery<Secret, ErrorResponse>({
    queryKey: secretQueryKeys.detail(okmsId, secretPath),
    queryFn: () => getSecret(okmsId, secretPath),
  });
};
