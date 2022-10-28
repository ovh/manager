import { useQuery } from '@tanstack/react-query';

import { getResourceGroup } from '@/api';

export default function useResourceGroup(resourceGroupId: string) {
  const { data: resourceGroup, isLoading: isResourceGroupLoading } = useQuery(
    ['iam_resource_group', resourceGroupId],
    () => getResourceGroup(resourceGroupId),
  );

  return {
    resourceGroup,
    isResourceGroupLoading,
  };
}
