export type TInternalActionName =
  | 'details'
  | 'edit'
  | 'soft_reboot'
  | 'hard_reboot'
  | 'rescue'
  | 'unrescue'
  | 'create_backup'
  | 'activate_monthly_billing'
  | 'delete'
  | 'stop'
  | 'start'
  | 'shelve'
  | 'unshelve'
  | 'reinstall';

export type TExternalActionName = 'create_autobackup' | 'assign_floating_ip';

export type TActionName = TInternalActionName | TExternalActionName | 'vnc';

export type TStatus =
  | 'ACTIVE'
  | 'BUILDING'
  | 'DELETED'
  | 'DELETING'
  | 'ERROR'
  | 'HARD_REBOOT'
  | 'PASSWORD'
  | 'PAUSED'
  | 'REBOOT'
  | 'REBUILD'
  | 'RESCUED'
  | 'RESIZED'
  | 'REVERT_RESIZE'
  | 'SOFT_DELETED'
  | 'STOPPED'
  | 'SUSPENDED'
  | 'UNKNOWN'
  | 'VERIFY_RESIZE'
  | 'MIGRATING'
  | 'RESIZE'
  | 'BUILD'
  | 'SHUTOFF'
  | 'RESCUE'
  | 'SHELVED'
  | 'SHELVING'
  | 'UNSHELVING'
  | 'SHELVED_OFFLOADED'
  | 'RESCUING'
  | 'UNRESCUING'
  | 'SNAPSHOTTING'
  | 'RESUMING';

export type TAddressType = 'public' | 'private' | 'floating';
export type TInstanceActionGroup =
  | 'boot'
  | 'delete'
  | 'details'
  | 'lifecycle'
  | 'shelve';

export type TPrice = {
  type: 'hour' | 'month' | 'licence' | 'savingplans' | string;
  status: 'enabled' | 'available' | 'eligible';
  value: number;
  text: string;
  priceInUcents: number;
  currencyCode: string;
  includeVat: boolean;
};

export type TRegionType = 'region' | 'localzone' | 'region-3-az' | string;

export type TSubnet = {
  id: string;
  name: string;
  gatewayIP: string;
  network: {
    id: string;
    name: string;
  };
};

export type TFlavorSpec = {
  value: number;
  unit: string;
};

export type TImage = {
  id: string;
  name: string;
  deprecated: boolean;
};

export type TBackup = {
  id: string;
  name: string;
  createdAt: string;
};

export type TSeverity = 'success' | 'error' | 'warning' | 'info';

export type TStatusSeverity = {
  label: TStatus;
  severity: TSeverity;
};
