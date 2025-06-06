import { TVolume } from '@ovh-ux/manager-pci-common';
import {
  TRegion,
  TRegionQuota,
  TVolumeCatalog,
  TVolumePricing,
} from '@/data/api/api.types';

export const MOCKED_PROJECT_ID = 'project-123';
export const MOCKED_VOLUME_ID = 'volume-id';
export const MOCKED_INSTANCE_ID = 'instance-id';
export const MOCKED_REGION_NAME = 'region-name';
export const MOCKED_VOLUME_BACKUP_ID = 'backup-id';
export const MOCKED_VOLUME_NAME = 'volume-name';
export const MOCKED_VOLUME_TYPE = 'classic';

export const MOCKED_VOLUME: TVolume = {
  id: MOCKED_VOLUME_ID,
  attachedTo: [MOCKED_INSTANCE_ID],
  creationDate: '2024-12-17T15:51:05Z',
  name: MOCKED_VOLUME_NAME,
  description: 'volume-description',
  size: 10,
  status: 'available',
  region: 'volume-region',
  bootable: false,
  planCode: 'volume-plan-code',
  regionName: MOCKED_REGION_NAME,
  statusGroup: 'volume-status-group',
  type: 'high-speed',
};

export const MOCKED_BACKUP = {
  id: MOCKED_VOLUME_BACKUP_ID,
  creationDate: '2024-12-17T15:51:05Z',
  name: 'backup-name',
  size: 100,
  volumeId: 'volume-id',
  region: 'region',
  status: 'ok',
  volume: MOCKED_VOLUME,
  search: 'backup-id backup-name region',
};

export const MOCK_REGION: TRegion = {
  name: 'AF-NORTH-LZ-RBA-A',
  type: 'localzone',
  availabilityZones: [],
  isInMaintenance: false,
  country: 'ma',
  isActivated: true,
  datacenter: 'RBA',
  filters: { deployment: ['localzone'], region: ['north_africa'] },
};

export const MOCK_PRICING: TVolumePricing = {
  regions: ['AF-NORTH-LZ-RBA-A'],
  price: 11510,
  interval: 'none',
  showAvailabilityZones: false,
  areIOPSDynamic: false,
  specs: {
    name: 'classic',
    gpu: { memory: {} },
    volume: {
      capacity: { max: 4000 },
      iops: {
        guaranteed: true,
        level: 250,
        max: 250,
        maxUnit: 'IOPS',
        unit: 'IOPS',
      },
    },
  },
};

export const MOCK_CATALOG: TVolumeCatalog = {
  filters: {
    deployment: [
      { name: 'region', tags: [] },
      { name: 'region-3-az', tags: ['is_new'] },
      { name: 'localzone', tags: [] },
    ],
    region: [],
  },
  regions: [MOCK_REGION],
  models: [
    {
      name: 'classic',
      tags: [],
      filters: {
        deployment: ['region', 'region-3-az', 'localzone'],
      },
      pricings: [MOCK_PRICING],
    },
  ],
};

export const MOCK_QUOTA: TRegionQuota = {
  region: 'AF-NORTH-LZ-RBA-A',
  volume: {
    maxGigabytes: 320000,
    usedGigabytes: 80,
    volumeCount: 6,
    maxVolumeCount: 8000,
  },
};
