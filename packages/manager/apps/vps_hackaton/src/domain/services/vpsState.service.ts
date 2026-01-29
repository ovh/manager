import type { TVps, TVpsState, TVpsList } from '../entities/vps';

export type TVpsStateCategory = 'success' | 'warning' | 'error' | 'info';

export const VPS_STATE_CATEGORIES: Record<TVpsState, TVpsStateCategory> = {
  running: 'success',
  stopped: 'error',
  stopping: 'error',
  maintenance: 'error',
  installing: 'warning',
  rebooting: 'warning',
  starting: 'warning',
  upgrading: 'warning',
  migrating: 'warning',
  backuping: 'warning',
  rescue: 'warning',
  rescued: 'warning',
  error: 'error',
};

export const getVpsStateCategory = (state: TVpsState): TVpsStateCategory =>
  VPS_STATE_CATEGORIES[state] ?? 'info';

export const selectVpsState = (vps: TVps): TVpsState => vps.state;

export const filterVpsByState =
  (targetState: TVpsState) =>
  (vpsList: TVpsList): TVpsList =>
    vpsList.filter((vps) => vps.state === targetState);

export const filterVpsByStateCategory =
  (targetCategory: TVpsStateCategory) =>
  (vpsList: TVpsList): TVpsList =>
    vpsList.filter(
      (vps) => getVpsStateCategory(vps.state) === targetCategory,
    );

export const isVpsActionable = (state: TVpsState): boolean =>
  !['installing', 'rebooting', 'starting', 'stopping', 'upgrading', 'migrating', 'backuping'].includes(state);

export const canReboot = (vps: TVps): boolean =>
  vps.state === 'running' || vps.state === 'rescue' || vps.state === 'rescued';

export const canStop = (vps: TVps): boolean =>
  vps.state === 'running';

export const canStart = (vps: TVps): boolean =>
  vps.state === 'stopped';

export const canRescue = (vps: TVps): boolean =>
  vps.state === 'running' || vps.state === 'stopped';

export const canReinstall = (vps: TVps): boolean =>
  vps.state === 'running' || vps.state === 'stopped';
