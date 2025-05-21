import { TAddon, TVolume } from '@ovh-ux/manager-pci-common';

export type TVolumeType =
  | 'classic'
  | 'classic-BETA'
  | 'high-speed'
  | 'high-speed-BETA'
  | 'high-speed-gen2'
  | string;

export type TBackupStatus =
  | 'creating'
  | 'deleting'
  | 'error'
  | 'ok'
  | 'restoring'
  | string;

export type TVolumeStatus =
  | 'attaching'
  | 'available'
  | 'awaiting-transfer'
  | 'backing-up'
  | 'creating'
  | 'deleting'
  | 'detaching'
  | 'downloading'
  | 'error'
  | 'error_backing-up'
  | 'error_deleting'
  | 'error_extending'
  | 'error_restoring'
  | 'extending'
  | 'in-use'
  | 'maintenance'
  | 'reserved'
  | 'restoring-backup'
  | 'retyping'
  | 'uploading'
  | string;

export type TBackup = {
  id: string;
  creationDate: string;
  name: string;
  size: number;
  volumeId: string;
  region: string;
  status: TBackupStatus;
};

export type TVolumeBackup = TBackup & {
  volume?: TVolume | null;
  search?: string;
};

export type TVolumePricing = {
  price: number;
  regions: TRegion['name'][];
  showAvailabilityZones: boolean;
  interval: 'day' | 'hour' | 'month' | 'none';
  specs: TAddon['blobs']['technical'];
  areIOPSDynamic: boolean;
};

export type TCatalogGroup = {
  name: string;
  tags: string[];
};

export type TVolumeCatalogFilter = {
  [key in 'deployment' | 'region']: TCatalogGroup[];
};

export type TVolumeCatalogElementFilter = {
  [Property in keyof TVolumeCatalogFilter]?: TVolumeCatalogFilter[Property][number]['name'][];
};

export type TRegion = {
  name: string;
  type: 'region-3-az' | 'region' | 'localzone';
  availabilityZones: string[];
  isInMaintenance: boolean;
  isActivated: boolean;
  country: string;
  filters: TVolumeCatalogElementFilter;
  datacenter: string;
};

export type TVolumeAddon = {
  name: string;
  tags: string[];
  filters: TVolumeCatalogElementFilter;
  pricings: TVolumePricing[];
};

export type TVolumeCatalog = {
  filters: TVolumeCatalogFilter;
  regions: TRegion[];
  models: TVolumeAddon[];
};

export type TRegionQuota = {
  region: string;
  volume: {
    maxGigabytes: number;
    usedGigabytes: number;
    volumeCount: number;
    maxVolumeCount: number;
  };
};

export type TProjectParams = {
  projectId: string;
};

export type TApiData<T> = {
  data: T[];
};
