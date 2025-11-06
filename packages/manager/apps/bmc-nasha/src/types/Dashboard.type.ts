/* eslint-disable @typescript-eslint/no-explicit-any */

// Raw API response types
export type NashaUseItemRaw = {
  unit: string;
  value: number;
};

export type NashaUseRaw = {
  [key: string]: NashaUseItemRaw;
  size: NashaUseItemRaw;
};

export type NashaRaw = {
  serviceName: string;
  customName?: string;
  datacenter: string;
  diskType: string;
  zpoolSize: number;
  monitored: boolean;
  use: NashaUseRaw;
  [key: string]: any;
};

export type ServiceInfoRaw = {
  creation?: string;
  domain?: string;
  expiration?: string;
  engagedUpTo?: string;
  renew?: {
    automatic: boolean;
    deleteAtExpiration: boolean;
    period?: number;
  };
  status?: string;
  [key: string]: any;
};

export type PartitionRaw = {
  partitionName: string;
  size: number;
  [key: string]: any;
};

// Transformed types
export type NashaUseItem = {
  unit: string;
  value: number;
  name: string;
};

export type NashaUse = {
  [key: string]: NashaUseItem;
  size: NashaUseItem;
};

export type Nasha = {
  serviceName: string;
  customName?: string;
  datacenter: string;
  localeDatacenter: string;
  diskType: string;
  diskSize: string;
  zpoolSize: number;
  monitored: boolean;
  use: NashaUse;
  [key: string]: any;
};

export type ServiceInfo = ServiceInfoRaw & {
  serviceType: string;
};

export type DashboardData = {
  nasha: Nasha;
  serviceInfo: ServiceInfo;
  partitionAllocatedSize: number;
  canCreatePartitions: boolean;
  isCommitmentAvailable: boolean;
  isNashaEolServiceBannerAvailable: boolean;
  shouldReengage: boolean;
  nashaApiUrl: string;
};

export type DashboardNavigation = {
  goToEditName: () => void;
  goToPartitionsCreate: () => void;
  reload: (options?: { success?: string; error?: unknown }) => Promise<void>;
};
