import { VCDDatacentre, VCDOrganization } from '@ovh-ux/manager-module-vcd-api';

export type UpdatableResource = VCDOrganization | VCDDatacentre;

const targetSpecKey = 'configure-target-spec';

export const isUpdatingTargetSpec = (resource: UpdatableResource | undefined): boolean =>
  (resource?.currentTasks?.some((task) => task.type === targetSpecKey) &&
    resource?.resourceStatus !== 'READY') ||
  false;

export const hasResourceUpdatingTargetSpec = (
  resources: UpdatableResource[] | undefined,
): boolean => resources?.some((resource) => isUpdatingTargetSpec(resource)) || false;
