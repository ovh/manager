import { ResourceStatus } from '../../../hooks';

export const SERVICE_STATES = [
  {
    state: 'active',
    label: 'service_state_active',
    color: 'success',
  } as const,
  {
    state: 'deleted',
    label: 'service_state_deleted',
    color: 'critical',
  } as const,
  {
    state: 'deleted',
    label: 'service_state_deleted',
    color: 'critical',
  } as const,
  {
    state: 'suspended',
    label: 'service_state_suspended',
    color: 'warning',
  } as const,
  {
    state: 'toActivate',
    label: 'service_state_toActivate',
    color: 'information',
  } as const,
  {
    state: 'toDelete',
    label: 'service_state_toDelete',
    color: 'information',
  } as const,
  {
    state: 'toSuspend',
    label: 'service_state_toSuspend',
    color: 'information',
  } as const,
  {
    state: 'unknown' as ResourceStatus,
    label: 'unknown',
    color: 'information',
  } as const,
];
