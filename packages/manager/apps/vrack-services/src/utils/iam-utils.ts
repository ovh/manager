import { useQuery } from '@tanstack/react-query';
import { ApiResponse, ApiError } from '@ovh-ux/manager-core-api';

import { useState, useEffect } from 'react';
import {
  IamAuthorizationsRequest,
  IamAuthorizationsResponse,
  getIamAuthorizationCheck,
  getIamAuthorizationCheckQuerykey,
} from '@/api';

/* function useIamResourceAuthorizationCheck({
  resourceURNs,
  actionsPage,
}: IamAuthorizationsRequest) {
  useQuery<ApiResponse<IamActionsAuthorizations>, ApiError>({
    queryKey: getIamResourceQueryKey(resourceURNs[0]),
    queryFn: () =>
      getIamResourceAuthorizationCheck({ resourceURNs, actionsPage }),
  });
} */

export const useIamAuthorizationCheckService = (
  iamAuthorizationsRequest?: IamAuthorizationsRequest,
) => {
  const [authorizations, setAuthorizations] = useState<
    IamAuthorizationsResponse[]
  >([]);

  const {
    data: iamAuthorizationCheckResponse,
    isLoading: isIamLoading,
    error: serviceListError,
  } = useQuery<ApiResponse<IamAuthorizationsResponse[]>, ApiError>({
    queryKey: getIamAuthorizationCheckQuerykey(
      iamAuthorizationsRequest?.resourceURNs,
    ),
    queryFn: () => getIamAuthorizationCheck(iamAuthorizationsRequest),
  });

  useEffect(() => {
    setAuthorizations(iamAuthorizationCheckResponse?.data || []);
  }, [iamAuthorizationCheckResponse?.data]);

  return {
    authorizations,
    isIamLoading,
  };
};
