import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { IamResource, deleteResourceTag } from '../api/iam-resources';
import {
  getAllIamResourceQueryKey,
  UseUpdateIamResourceResponse,
} from './useIamResources';
import { getAllIamTagsQueryKey } from '../api/get-iam-tags';
import { ResourcesBulkResult } from '@/components/resourcesBulkResult/ResourcesBulkResult.component';

export type UseDeleteResourcesTagParams = {
  onSuccess?: (
    data: UseUpdateIamResourceResponse,
    variables: {
      resources: IamResource[];
      tagKey: string;
    },
    context: unknown,
  ) => unknown;
  onError?: (
    error: Error,
    variables: {
      resources: IamResource[];
      tagKey: string;
    },
    context: unknown,
  ) => unknown;
};

export const useDeleteResourcesTag = ({
  onSuccess,
  onError,
}: UseDeleteResourcesTagParams) => {
  const { addWarning, addSuccess, addError } = useNotifications();
  const { t } = useTranslation('tag-manager');
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      resources,
      tagKey,
    }: {
      resources: IamResource[];
      tagKey: string;
    }) => {
      // Make parrallel calls to update each resource but wait for all to be done to display notification.
      const promises = resources.map((resource) =>
        deleteResourceTag({
          resource,
          tagKey,
        }).catch((error) => error),
      );
      const results = await Promise.all(promises);

      return results.reduce(
        (formatted, result, currentIndex) => {
          if (result instanceof Error) {
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
            error={t('resourcesUnassignTagSomeError')}
          />,
        );
      } else if (error.length > 0) {
        addError(
          <ResourcesBulkResult
            result={{ success, error }}
            error={t('resourcesUnassignTagError')}
          />,
        );
      } else {
        addSuccess(t('resourcesUnassignTagSuccess'));
      }
    },
  });
};
