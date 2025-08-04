import {
  useNotifications,
  useResourcesIcebergV2,
} from '@ovh-ux/manager-react-components';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import {
  IamResource,
  getIamResourceType,
  getIamResourcetypeQueryKey,
  putIamResource,
} from '../api/iam-resources';
import { NotificationList } from '@/components/notificationList/NotificationList.component';
import { ResourcesDatagridFilter } from '@/components/resourcesDatagridTopbar/ResourcesDatagridTopbar.component';
import { formatFiltersForApi } from '@/utils/formatFiltersForApi';

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
    error: string;
  }>;
};

export const useUpdateIamResources = () => {
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
          if (result instanceof Error) {
            formatted.error.push({
              resource: resources[currentIndex],
              error: result.message,
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
    onSettled: ({ success, error }) => {
      queryClient.invalidateQueries({
        queryKey: getAllIamResourceQueryKey(),
      });

      if (success.length > 0 && error.length > 0) {
        addWarning(
          <NotificationList
            items={error.map(({ resource }) => ({
              label: resource.displayName,
              id: resource.id,
            }))}
            error={t('resourcesTaggedSomeError')}
          />,
        );
      } else if (error.length > 0) {
        addError(t('resourcesTaggedError'));
      } else {
        addSuccess(t('resourcesTaggedSuccess'));
      }
    },
  });
};
