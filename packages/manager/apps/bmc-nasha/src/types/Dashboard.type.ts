export type NashaApiData = {
  serviceName: string;
  customName?: string;
  datacenter: string;
  diskType: string;
  monitored: boolean;
  zpoolSize: number;
  ip?: string;
  use: Record<string, { unit: string; value: number }>;
  [key: string]: unknown;
};

export type NashaPrepared = Omit<NashaApiData, 'use'> & {
  use: Record<string, { unit: string; value: number; name: string }>;
  localeDatacenter: string;
  diskSize: string;
};

export type PartitionApiData = {
  partitionName: string;
  partitionDescription?: string;
  protocol: string;
  size: number;
  use?: Record<string, { unit: string; value: number }>;
  [key: string]: unknown;
};

export type PartitionPrepared = Omit<PartitionApiData, 'use' | 'protocol'> & {
  use: Record<string, { unit: string; value: number; name: string }> | null;
  protocol: string;
};

export type ServiceInfo = {
  creation: string;
  domain: string;
  expiration?: string;
  engagedUpTo?: string;
  serviceId: number;
  status: string;
  serviceType: string;
  [key: string]: unknown;
};
