import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { OkmsCredential } from '@/types/okmsCredential.type';
import {
  getOkmsCredential,
  getOkmsCredentials,
  getOkmsCredentialsQueryKey,
  getOkmsCredentialQueryKey,
} from '../api/okmsCredential';
import { ErrorResponse } from '@/types/api.type';

/* Credential List */

export const useOkmsCredentials = (okmsId: string) => {
  return useQuery<{ data: OkmsCredential[] }, ApiError>({
    queryKey: getOkmsCredentialsQueryKey(okmsId),
    queryFn: () => getOkmsCredentials(okmsId),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};

/* Credential */

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
