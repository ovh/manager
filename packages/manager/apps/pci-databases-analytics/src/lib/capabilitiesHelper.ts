import { StateEnum } from '@/types/cloud/project/database/service/capability';
import { CapabilityActions } from '../types/cloud/project/database/service/CapabilityActions';
import { CapabilityEnum } from '../types/cloud/project/database/service/CapabilityEnum';

export type CapabilityName = keyof typeof CapabilityEnum;
export type CapabilityAction = keyof CapabilityActions;

export type ServiceWithCapabilities = {
  capabilities?: Record<string, CapabilityActions>;
};

export function capability(
  service: ServiceWithCapabilities | undefined,
  cap: CapabilityName,
  action: CapabilityAction,
) {
  return service?.capabilities?.[cap]?.[action];
}

export function isCapabilityDisabled(
  service: ServiceWithCapabilities | undefined,
  cap: CapabilityName,
  action: CapabilityAction = 'update',
) {
  return capability(service, cap, action) === StateEnum.disabled;
}
