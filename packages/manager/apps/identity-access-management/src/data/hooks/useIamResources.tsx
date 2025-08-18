import {
  useNotifications,
  useResourcesIcebergV2,
} from '@ovh-ux/manager-react-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { AxiosError } from 'axios';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  IamResource,
  getIamResourceType,
  getIamResourcetypeQueryKey,
  putIamResource,
} from '../api/iam-resources';
import { ResourcesDatagridFilter } from '@/components/resourcesDatagridTopbar/ResourcesDatagridTopbar.component';
import { formatFiltersForApi } from '@/utils/formatFiltersForApi';
import { getAllIamTagsQueryKey } from '../api/get-iam-tags';
import { ResourcesBulkResult } from '@/components/resourcesBulkResult/ResourcesBulkResult.component';

export type GetIamResourceListQueryKeyParams = {
  filters?: ResourcesDatagridFilter[];
};

export const getAllIamResourceQueryKey = () => ['get/iam/resource'];

export const getIamResourceListQueryKey = ({
  filters,
}: GetIamResourceListQueryKeyParams) => {
  return [
    ...getAllIamResourceQueryKey(),
    ...filters.map((filter) => filter.id),
  ];
};

export const useIamResourceList = ({
  pageSize,
  filters,
}: {
  pageSize?: number;
  filters?: ResourcesDatagridFilter[];
}) => {
  const queryParams = formatFiltersForApi(filters);
  const route = `/iam/resource${queryParams !== '' ? `?${queryParams}` : ''}`;
  return useResourcesIcebergV2<IamResource>({
    route,
    queryKey: getIamResourceListQueryKey({ filters }),
    pageSize,
  });
};

export const useIamResourceTypeList = () => {
  const { t } = useTranslation('resource-type');
  return useQuery({
    queryKey: getIamResourcetypeQueryKey,
    queryFn: getIamResourceType,
    select: ({ data }) => {
      return data.map((type) => ({
        label: t(`iam_resource_type_${type}`),
        value: type,
      }));
    },
  });
};

export type UseUpdateIamResourceResponse = {
  success: Array<{
    resource: IamResource;
    error: null;
  }>;
  error: Array<{
    resource: IamResource;
    error: ApiError;
  }>;
};

export type UseUpdateIamResourcesParams = {
  onSuccess?: (
    data: UseUpdateIamResourceResponse,
    variables: {
      resources: IamResource[];
      tags: Record<string, string>;
    },
    context: unknown,
  ) => unknown;
  onError?: (
    error: Error,
    variables: {
      resources: IamResource[];
      tags: Record<string, string>;
    },
    context: unknown,
  ) => unknown;
};
export const useUpdateIamResources = ({
  onSuccess,
  onError,
}: UseUpdateIamResourcesParams) => {
  const { addWarning, addSuccess, addError } = useNotifications();
  const { t } = useTranslation('tag-manager');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      resources,
      tags,
    }: {
      resources: IamResource[];
      tags: Record<string, string>;
    }) => {
      // Make parrallel calls to update each resource but wait for all to be done to display notification.
      const promises = resources.map((resource) =>
        putIamResource({
          resource,
          tags,
        }).catch((error) => error),
      );
      const results = await Promise.all(promises);

      return results.reduce<UseUpdateIamResourceResponse>(
        (formatted, result, currentIndex) => {
          if (result instanceof AxiosError) {
            formatted.error.push({
              resource: resources[currentIndex],
              error: result,
            });
          } else {
            formatted.success.push({
              resource: resources[currentIndex],
              error: null,
            });
          }
          return formatted;
        },
        { success: [], error: [] },
      );
    },
    onSuccess,
    onError,
    onSettled: ({ success, error }) => {
      queryClient.invalidateQueries({
        queryKey: getAllIamResourceQueryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: getAllIamTagsQueryKey(),
      });

      if (success.length > 0 && error.length > 0) {
        addWarning(
          <ResourcesBulkResult
            result={{ success, error }}
            error={t('resourcesTaggedSomeError')}
          />,
        );
      } else if (error.length > 0) {
        addError(
          <ResourcesBulkResult
            result={{ success, error }}
            error={t('resourcesTaggedError')}
          />,
        );
      } else {
        addSuccess(t('resourcesTaggedSuccess'));
      }
    },
  });
};
