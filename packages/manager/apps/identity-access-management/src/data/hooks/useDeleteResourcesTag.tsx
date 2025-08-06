import { useNotifications } from '@ovh-ux/manager-react-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { IamResource, deleteResourceTag } from '../api/iam-resources';
import { getAllIamResourceQueryKey } from './useIamResources';
import { getAllIamTagsQueryKey } from '../api/get-iam-tags';
import { NotificationList } from '@/components/notificationList/NotificationList.component';

export const useDeleteResourcesTag = () => {
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
      queryClient.invalidateQueries({
        queryKey: getAllIamTagsQueryKey(),
      });

      if (success.length > 0 && error.length > 0) {
        addWarning(
          <NotificationList
            items={error.map(({ resource }: { resource: IamResource }) => ({
              label: resource.displayName,
              id: resource.id,
            }))}
            error={t('resourcesUnassignTagSomeError')}
          />,
        );
      } else if (error.length > 0) {
        addError(t('resourcesUnassignTagError'));
      } else {
        addSuccess(t('resourcesUnassignTagSuccess'));
      }
    },
  });
};
