export interface NashaUseItem {
  unit: string;
  value: number;
  name?: string;
}

export type NashaUse = Record<string, NashaUseItem>;

export interface Nasha {
  serviceName: string;
  canCreatePartition: boolean;
  customName: string;
  datacenter: string;
  diskType: string;
  monitored: boolean;
  zpoolCapacity: number;
  zpoolSize: number;
  id?: string;
  ip: string;
  use: NashaUse;
  localeDatacenter?: string;
  diskSize?: string;
}

export interface NashaServiceInfo {
  contactAdmin: string;
  contactBilling: string;
  contactTech: string;
  creation: string;
  domain: string;
  engagedUpTo: string | null;
  expiration: string;
  possibleRenewPeriod: number[];
  renew: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    forced: boolean;
    manualPayment: boolean;
    period: number;
  };
  renewalType: string;
  serviceId: number;
  status: string;
  serviceType?: string;
}

export interface NashaPartition {
  partitionName: string;
  partitionDescription?: string;
  protocol: string;
  size: number;
  use: NashaUse | null;
}

export interface NashaAccess {
  ip: string;
  type: string;
  typeLabel?: string;
  aclDescription?: string;
  isForm?: boolean;
}

export interface NashaSnapshot {
  snapshotType: string;
}

export interface NashaCustomSnapshot {
  name: string;
}

export interface NashaTask {
  taskId: number;
  operation: string;
  status: string;
  partitionName?: string;
  details?: string;
  todoDate?: string;
  doneDate?: string;
}

export interface NashaZfsOptions {
  atime: string;
  recordsize: string;
  sync: string;
}

export interface ZfsOptionsModel {
  atime: boolean;
  recordsize: string;
  sync: string;
  template?: { name: string; description?: string };
}

export interface EnumOption {
  label: string;
  value: string;
  default?: boolean;
}

export interface ApiSchema {
  models: Record<
    string,
    {
      enum: string[];
      description?: string;
    }
  >;
}

export interface AuthorizedAccess {
  type: string;
  ip: string;
}

export interface CreatePartitionParams {
  partitionName: string;
  partitionDescription?: string;
  size: number;
  protocol: string;
}

export interface CreateAccessParams {
  ip: string;
  type: string;
  aclDescription?: string;
}

export interface UpdatePartitionParams {
  size?: number;
  partitionDescription?: string;
}
