import { TInstance } from '@/api/hooks/instance/selector/instances.selector';
import { useInstanceSnapshotPricing } from '@/api/hooks/order/order';
import { TWorkflowResourceId, WorkflowType } from '@/api/hooks/workflows';

export const isSameResource = (a: TWorkflowResourceId, b: TWorkflowResourceId): boolean =>
  a.id === b.id && a.region === b.region;

export const useResourcePricing = (
  workflowType: WorkflowType,
  projectId: string,
  resourceId: TWorkflowResourceId,
) => {
  const { pricing, isPending } = useInstanceSnapshotPricing(
    workflowType === WorkflowType.INSTANCE_BACKUP,
    projectId,
    {
      id: resourceId.id,
      region: resourceId.region,
    } as TInstance['id'],
  );

  return { pricing, isPending };
};
