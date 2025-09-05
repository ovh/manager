import { VCDDatacentre, VCDOrganization } from '@ovh-ux/manager-module-vcd-api';

export type UpdatableResource = VCDOrganization | VCDDatacentre;

const targetSpecKey = 'configure-target-spec';

export const isUpdatingTargetSpec = (resource: UpdatableResource | undefined) =>
  resource?.currentTasks?.some((task) => task.type === targetSpecKey) &&
  resource?.resourceStatus !== 'READY';

export const hasResourceUpdatingTargetSpec = (
  resources: UpdatableResource[] | undefined,
) => resources?.some((resource) => isUpdatingTargetSpec(resource));
