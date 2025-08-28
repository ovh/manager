import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { ApiResponse } from '@ovh-ux/manager-core-api';
import {
  IamTagApiError,
  IamTagRequest,
  IamTagResponse,
  getIamTags,
  getIamTagsQueryKey,
} from '../api/get-iam-tags';

/**
 * Fetch the iam tags of the user
 */
export const useGetIamTags = ({
  internalTags,
  unassignedResources,
  resourceType,
  resourceURN,
}: IamTagRequest) => {
  const { data, ...query } = useQuery<
    ApiResponse<IamTagResponse>,
    AxiosError<IamTagApiError>
  >({
    queryKey: getIamTagsQueryKey({
      internalTags,
      unassignedResources,
      resourceType,
      resourceURN,
    }),
    queryFn: () =>
      getIamTags({
        internalTags,
        unassignedResources,
        resourceType,
        resourceURN,
      }),
  });

  return {
    tags: data?.data,
    ...query,
  };
};
