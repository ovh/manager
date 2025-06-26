import { useQuery } from '@tanstack/react-query';
import { Secret } from '@secret-manager/types/secret.type';
import { ErrorResponse } from '@/types/api.type';
import {
  getSecretList,
  secretListQueryKey,
} from '@/modules/secret-manager/data/api/secrets';

export const useSecretList = (okmsId: string) => {
  return useQuery<Secret[], ErrorResponse>({
    queryKey: secretListQueryKey(okmsId),
    queryFn: () => getSecretList(okmsId),
  });
};
