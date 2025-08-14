export type TActionName =
  | 'details'
  | 'edit'
  | 'assign_floating_ip'
  | 'activate_monthly_billing'
  | 'create_backup'
  | 'create_autobackup'
  | 'start'
  | 'stop'
  | 'rescue'
  | 'unrescue'
  | 'soft_reboot'
  | 'hard_reboot'
  | 'shelve'
  | 'unshelve'
  | 'resume'
  | 'reinstall'
  | 'delete';

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
