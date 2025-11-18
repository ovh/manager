import { TAddon } from '@ovh-ux/manager-pci-common/dist/types/api/data/catalog';

import { TInstance } from '@/api/hooks/instance/selector/instances.selector';
import { useInstanceSnapshotPricing } from '@/api/hooks/order/order';
import { TWorkflowResourceId, WorkflowType } from '@/api/hooks/workflows';

export const isSameResource = (a: TWorkflowResourceId, b: TWorkflowResourceId): boolean =>
  a.id === b.id && a.region === b.region;

export const getResourcePricing = (
  workflowType: WorkflowType,
): ((
  projectId: string,
  resourceId: TWorkflowResourceId,
) => {
  isPending: boolean;
  pricing: TAddon['pricings'][0] | null;
}) => {
  if (workflowType === WorkflowType.INSTANCE_BACKUP) {
    return (projectId: string, resourceId: TWorkflowResourceId) =>
      useInstanceSnapshotPricing(projectId, {
        id: resourceId.id,
        region: resourceId.region,
      } as TInstance['id']);
  }

  return () => ({
    pricing: null,
    isPending: false,
  });
};
