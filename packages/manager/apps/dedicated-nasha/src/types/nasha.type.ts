export interface NashaUsage {
  used: number;
  size: number;
  usedBySnapshots: number;
}

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
  use: Record<string, {
    unit: string;
    value: number;
  }>;
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
}
