import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { OkmsCredential } from '@/types/okmsCredential.type';
import { getOkmsCredential, getOkmsCredentials } from '../api/okmsCredential';
import { ErrorResponse } from '@/types/api.type';

/* Credential List */

export const getOkmsCredentialsQueryKey = (okmsId: string) => [
  `get/okms/resource/${okmsId}/credential`,
];

export const useOkmsCredentials = ({
  okmsId,
  deletingCredentialId,
}: {
  okmsId: string;
  deletingCredentialId?: OkmsCredential['id'];
}) => {
  return useQuery<{ data: OkmsCredential[] }, ApiError>({
    queryKey: getOkmsCredentialsQueryKey(okmsId),
    queryFn: () => getOkmsCredentials(okmsId),
    retry: false,
    ...{
      keepPreviousData: true,
    },
    refetchInterval: (query) => {
      return deletingCredentialId &&
        query?.state?.data?.data?.find(
          (credential) => credential.id === deletingCredentialId,
        )
        ? 2000
        : false;
    },
  });
};

/* Credential */

export const getOkmsCredentialQueryKey = ({
  okmsId,
  credentialId,
}: {
  okmsId: string;
  credentialId: string;
}) => [`get/okms/resource/${okmsId}/credential/${credentialId}`];

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
