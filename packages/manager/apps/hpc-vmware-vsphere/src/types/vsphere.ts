export enum VMWareState {
  Available = 'available',
  Delivered = 'delivered',
  Disabled = 'disabled',
  Disabling = 'disabling',
  Error = 'error',
  Migrating = 'migrating',
  Provisioning = 'provisionning',
  Recycling = 'recycling',
  Reserved = 'reserved',
  ToDisable = 'toDisable',
  ToProvision = 'toProvision',
  ToRecycle = 'toRecycle',
  ToRemove = 'toRemove',
  ToUnprovision = 'toUnprovision',
  Unprovisioning = 'unprovisionning',
  Upgrading = 'upgrading',
}

export type TVMwareVSphere = {
  serviceName: string;
  iam: {
    urn: string;
    displayName: string;
    id: string;
  };
  state: VMWareState;
};

export enum VMWareStatus {
  MIGRATING,
  ESSENTIALS,
  PREMIER,
  PREMIER_ACTIVATION,
  SNC,
}
