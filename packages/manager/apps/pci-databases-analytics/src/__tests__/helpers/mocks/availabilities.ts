import { FullCapabilities } from '@/hooks/api/database/capabilities/useGetFullCapabilities.hook';
import * as database from '@/types/cloud/project/database';

export const mockedAvailabilities: database.Availability = {
  backup: database.BackupTypeEnum.automatic,
  backupRetentionDays: 2,
  backups: {
    available: true,
    retentionDays: 2,
  },
  category: database.engine.CategoryEnum.all,
  default: false,
  engine: database.EngineEnum.mongodb,
  flavor: 'flavor',
  lifecycle: {
    startDate: '1989/04/08',
    status: database.availability.StatusEnum.STABLE,
  },
  plan: 'plan',
  region: 'region',
  specifications: {
    flavor: 'flavor',
    network: database.NetworkTypeEnum.public,
    nodes: {
      maximum: 3,
      minimum: 1,
    },
    storage: {
      maximum: {
        unit: 'GB',
        value: 20,
      },
      minimum: {
        unit: 'GB',
        value: 180,
      },
      step: {
        unit: 'GB',
        value: 10,
      },
    },
  },
  version: 'version',
  maxDiskSize: 250,
  maxNodeNumber: 3,
  minDiskSize: 50,
  minNodeNumber: 1,
  network: database.NetworkTypeEnum.public,
  startDate: '1989/04/08',
  status: database.availability.StatusEnum.STABLE,
  stepDiskSize: 10,
};

export const mockedSuggestions: database.availability.Suggestion = {
  default: true,
  engine: database.EngineEnum.mongodb,
  flavor: 'flavor',
  plan: 'plan',
  region: 'region',
  version: 'version',
};

export const mockedEngine: database.capabilities.Engine = {
  category: database.engine.CategoryEnum.operational,
  defaultVersion: 'defaultVersion',
  description: 'description',
  name: database.EngineEnum.mongodb,
  sslModes: ['sslModes'],
  storage: database.capabilities.engine.storage.StrategyEnum.distributed,
  versions: ['version'],
};

export const mockedFlavor: database.capabilities.Flavor = {
  core: 3,
  lifecycle: {
    startDate: 'startDate',
    status: database.availability.StatusEnum.STABLE,
  },
  memory: 3,
  name: 'flavor',
  order: 3,
  specifications: {
    core: 3,
    memory: {
      unit: 'unit',
      value: 3,
    },
    storage: {
      unit: 'unit',
      value: 4,
    },
  },
  storage: 250,
  tags: [database.capabilities.TagEnum.current],
};

export const mockedOption: database.capabilities.Option = {
  name: 'optionName',
  type: database.TypeEnum.boolean,
};

export const mockedPlan: database.capabilities.Plan = {
  backupRetention: 'backupRetention',
  description: 'description',
  lifecycle: {
    startDate: 'startDate',
    status: database.availability.StatusEnum.STABLE,
  },
  name: 'plan',
  order: 3,
  tags: [database.capabilities.TagEnum.current],
};

export const mockedCapabilities: database.Capabilities = {
  disks: ['disk1', 'disk2'],
  engines: [mockedEngine],
  flavors: [mockedFlavor],
  options: [mockedOption],
  plans: [mockedPlan],
  regions: ['Region1', 'Region2'],
};

export const mockedEngineCapabilities: database.capabilities.EngineCapabilities = {
  category: database.engine.CategoryEnum.operational,
  description: 'description',
  lifecycle: {
    startDate: 'startDate',
    status: database.availability.StatusEnum.STABLE,
  },
  name: database.EngineEnum.mongodb,
  order: 1,
  sslModes: ['sslModes'],
  storage: database.capabilities.engine.storage.StrategyEnum.distributed,
  tags: [database.capabilities.TagEnum.current],
  versions: [
    {
      default: true,
      lifecycle: {
        startDate: 'startDate',
        status: database.availability.StatusEnum.STABLE,
      },
      name: 'version',
      tags: [database.capabilities.TagEnum.current],
    },
  ],
};

export const mockedRegionCapabilities: database.capabilities.RegionCapabilities = {
  lifecycle: {
    startDate: 'startDate',
    status: database.availability.StatusEnum.STABLE,
  },
  name: 'region',
  order: 1,
  tags: [database.capabilities.TagEnum.current],
};

export const mockedFullCapabilities: FullCapabilities = {
  disks: ['disk1', 'disk2'],
  engines: [mockedEngineCapabilities],
  flavors: [mockedFlavor],
  options: [mockedOption],
  plans: [mockedPlan],
  regions: [mockedRegionCapabilities],
};

export const mockedAvailabilitiesUpdate: database.Availability = {
  backup: database.BackupTypeEnum.automatic,
  backupRetentionDays: 2,
  backups: {
    available: true,
    retentionDays: 2,
  },
  category: database.engine.CategoryEnum.all,
  default: false,
  engine: database.EngineEnum.mongodb,
  flavor: 'flavor',
  lifecycle: {
    startDate: '1989/04/08',
    status: database.availability.StatusEnum.STABLE,
  },
  plan: 'plan',
  region: 'region',
  specifications: {
    flavor: 'flavor',
    network: database.NetworkTypeEnum.public,
    nodes: {
      maximum: 3,
      minimum: 1,
    },
  },
  version: 'version',
  maxDiskSize: 250,
  maxNodeNumber: 3,
  minDiskSize: 50,
  minNodeNumber: 1,
  network: database.NetworkTypeEnum.public,
  startDate: '1989/04/08',
  status: database.availability.StatusEnum.STABLE,
  stepDiskSize: 10,
};
