/* eslint-disable @typescript-eslint/no-explicit-any */

export type NashaService = {
  serviceName: string;
  customName?: string;
  datacenter: string;
  diskType?: 'hdd' | 'ssd';
  canCreatePartition?: boolean;
  monitored?: boolean;
  zpoolCapacity?: number; // in GB
  zpoolSize?: number; // in GB
  use?: {
    size?: {
      unit: string;
      value: number;
      name: string;
    };
    usedbysnapshots?: {
      unit: string;
      value: number;
      name: string;
    };
    [key: string]: {
      unit: string;
      value: number;
      name: string;
    } | undefined;
  };
  localeDatacenter?: string;
  diskSize?: string;
};

export type NashaPartition = {
  partitionName: string;
  size: number; // in GB
  protocol: string; // e.g., 'NFS', 'CIFS', 'NFS_CIFS'
  path: string;
  description?: string;
  use?: {
    size: {
      unit: string;
      value: number;
      name: string;
    };
    [key: string]: {
      unit: string;
      value: number;
      name: string;
    };
  } | null;
};

export type NashaSnapshot = {
  snapshotName: string;
  description?: string;
  creationDate: string;
  size: number; // in GB
};

export type NashaAccess = {
  ip: string;
  type: 'readwrite' | 'readonly';
  description?: string;
  aclType?: string;
};

export type NashaQuota = {
  uid: number;
  gid: number;
  size: number; // in GB
  used: number; // in GB
  path: string;
};

export type NashaServiceDetails = NashaService & {
  partitions: NashaPartition[];
  snapshots: NashaSnapshot[];
  access: NashaAccess[];
  quotas: NashaQuota[];
  serviceInfos?: {
    serviceType: string;
    engagedUpTo?: string;
    [key: string]: any;
  };
};

export type NashaOrder = {
  datacenter: string;
  protocol: 'NFS' | 'CIFS';
  size: number; // in GB
  customName?: string;
};

export type NashaApiResponse<T> = {
  data: T;
  totalCount?: number;
  status: 'success' | 'error';
  message?: string;
};
