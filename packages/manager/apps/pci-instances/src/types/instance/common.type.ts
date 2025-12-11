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
  | 'delete'
  | 'vnc';

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

export enum BILLING_TYPE {
  Hourly = 'hourly',
  Monthly = 'monthly',
}

export const DEPLOYMENT_MODES = ['region', 'localzone', 'region-3-az'] as const;
export type TDeploymentMode = typeof DEPLOYMENT_MODES[number];

export type TSubnet = {
  id: string;
  name: string;
  gatewayIP: string;
  network: {
    id: string;
    name: string;
  };
};

export type TFlavor = {
  name: string;
  memory: number;
  vcore: number;
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

export type TFlavorTag = 'new' | 'savings_plan' | 'coming_soon';

export const DISTRIBUTION_IMAGE_NAME = [
  'almalinux',
  'centos',
  'cpanel',
  'cloudlinux',
  'dataiku',
  'datascience',
  'debian',
  'docker',
  'fedora',
  'freebsd',
  'linux',
  'minikube',
  'n8n',
  'nvidia_ngc',
  'plesk',
  'rockylinux',
  'rstudio',
  'ubuntu',
  'windows',
] as const;

export type TDistributionImageName = typeof DISTRIBUTION_IMAGE_NAME[number];
