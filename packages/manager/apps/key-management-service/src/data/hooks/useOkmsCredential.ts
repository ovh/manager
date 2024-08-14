/* Service Key */

import { useQuery } from '@tanstack/react-query';
import { OkmsCredential } from '@/types/okmsCredential.type';
import {
  getOkmsCredential,
  getOkmsCredentialQueryKey,
} from '../api/okmsCredential';
import { ErrorResponse } from '@/types/api.type';

export const useOkmsCredentialById = ({
  okmsId,
  credentialId,
}: {
  okmsId: string;
  credentialId: string;
}) => {
  return useQuery<{ data: OkmsCredential }, ErrorResponse>({
    queryKey: getOkmsCredentialQueryKey({ okmsId, credentialId }),
    queryFn: () => getOkmsCredential({ okmsId, credentialId }),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};
