import IVcdDatacentre from '@/types/vcd-datacenter.interface';
import IVcdOrganization from '@/types/vcd-organization.interface';

export type UpdatableResource = IVcdOrganization | IVcdDatacentre;

const targetSpecKey = 'configure-target-spec';

export const isUpdatingTargetSpec = (resource: UpdatableResource | undefined) =>
  resource?.currentTasks?.some((task) => task.type === targetSpecKey);

export const hasResourceUpdatingTargetSpec = (
  resources: UpdatableResource[] | undefined,
) => resources?.some((resource) => isUpdatingTargetSpec(resource));
