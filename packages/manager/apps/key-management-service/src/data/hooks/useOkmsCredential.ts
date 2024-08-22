import { useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { ColumnSort } from '@ovhcloud/manager-components';
import { OkmsCredential } from '@/types/okmsCredential.type';
import {
  getOkmsCredential,
  getOkmsCredentials,
  getOkmsCredentialsQueryKey,
  getOkmsCredentialQueryKey,
  sortOkmscredentials,
} from '../api/okmsCredential';
import { ErrorResponse } from '@/types/api.type';

/* Credential List */

const useOkmsAllCredentials = (okmsId: string) => {
  return useQuery<{ data: OkmsCredential[] }, ApiError>({
    queryKey: getOkmsCredentialsQueryKey(okmsId),
    queryFn: () => getOkmsCredentials(okmsId),
    retry: false,
    ...{
      keepPreviousData: true,
    },
  });
};

type OkmsCredentialsListOptions = {
  sorting: ColumnSort;
  okmsId: string;
};

export const useOkmsCredentials = ({
  sorting,
  okmsId,
}: OkmsCredentialsListOptions) => {
  const {
    data: credentials,
    error: credentialsError,
    isLoading: isLoadingCredetials,
  } = useOkmsAllCredentials(okmsId);

  return {
    isLoading: isLoadingCredetials,
    error: credentialsError,
    data: sortOkmscredentials(credentials?.data || [], sorting),
  };
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
