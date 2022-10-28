import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { RJSFSchema } from '@rjsf/utils';

import { listResource } from '@/api';
import useResourceGroup from './useResourceGroup';

export type IamResourceGroupFormData = {
  name: string;
  resources: string[];
};

export default function useResourceGroupForm(resourceGroupId?: string) {
  const { t } = useTranslation('iam/groups');
  let isResourceGroupLoading = false;

  const { data: resources, isLoading: isResourcesLoading } = useQuery(
    ['iam_resource'],
    async () => listResource(),
    {
      staleTime: 60 * 1000,
      refetchInterval: 60 * 1000,
    },
  );

  // manage form schema
  let schema: RJSFSchema;

  if (!isResourcesLoading) {
    schema = {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          title: t('group_name'),
          pattern: '^[a-zA-Z0-9_+-\\/]*$',
        },
        resources: {
          type: 'array',
          title: t('group_resources'),
          uniqueItems: true,
          items: {
            type: 'string',
            anyOf: resources.map(({ id, name }) => ({
              type: 'string',
              enum: [id],
              title: name,
            })),
          },
        },
      },
      required: ['name'],
    };
  }

  // manage form data
  let formData;

  if (resourceGroupId) {
    const {
      resourceGroup,
      isResourceGroupLoading: isLoading,
    } = useResourceGroup(resourceGroupId);
    isResourceGroupLoading = isLoading;

    if (!isResourceGroupLoading) {
      formData = {
        ...resourceGroup,
        resources: resourceGroup.resources.map(({ id }) => id),
      };
    }
  }

  const getGroupPayload = (submittedData: IamResourceGroupFormData) => {
    return {
      ...submittedData,
      resources: (submittedData.resources || []).map((resourceId: string) => ({
        id: resourceId,
      })),
    };
  };

  return {
    isFormLoading: isResourcesLoading || isResourceGroupLoading,
    schema,
    formData,
    getGroupPayload,
  };
}
