export type NashaService = {
  serviceName: string;
  canCreatePartition: boolean;
  customName?: string;
  datacenter: string;
  diskType: string;
  monitored: boolean;
  zpoolCapacity?: number;
  zpoolSize?: number;
};



