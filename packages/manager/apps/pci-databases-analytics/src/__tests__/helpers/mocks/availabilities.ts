import { FullCapabilities } from '@/hooks/api/availabilities.api.hooks';
import { database } from '@/models/database';

export const mockedAvailabilities: database.Availability = {
  backup: database.BackupTypeEnum.automatic,
  backupRetentionDays: 2,
  backups: {
    available: true,
    retentionDays: 2,
  },
  category: database.CategoryEnum.all,
  default: false,
  engine: 'engine',
  flavor: 'flavor',
  lifecycle: {
    startDate: '1989/04/08',
    status: database.availability.StatusEnum.STABLE,
  },
  plan: 'Plan',
  region: 'Region',
  specifications: {
    flavor: 'flavor',
    network: database.NetworkTypeEnum.public,
    nodes: {
      maximum: 3,
      minimum: 1,
    },
  },
  version: 'Version',
  maxDiskSize: 250,
  maxNodeNumber: 3,
  minDiskSize: 50,
  minNodeNumber: 1,
  network: database.NetworkTypeEnum.public,
  startDate: '1989/04/08',
  status: database.availability.StatusEnum.STABLE,
  stepDiskSize: 10,
};

export const mockedSuggestions: database.Suggestion = {
  default: true,
  engine: 'engine',
  flavor: 'flavor',
  plan: 'plan',
  region: 'region',
  version: 'version',
};

export const mockedEngine: database.capabilities.Engine = {
  category: database.CategoryEnum.operational,
  defaultVersion: 'defaultVersion',
  description: 'description',
  name: 'engineName',
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
  name: 'flavorName',
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
  tags: [database.capabilities.Tags.current],
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
  name: 'planName',
  order: 3,
  tags: [database.capabilities.Tags.current],
};

export const mockedCapabilities: database.Capabilities = {
  disks: ['disk1', 'disk2'],
  engines: [mockedEngine],
  flavors: [mockedFlavor],
  options: [mockedOption],
  plans: [mockedPlan],
  regions: ['Region1', 'Region2'],
};

export const mockedEngineCapabilities: database.EngineCapabilities = {
  category: database.CategoryEnum.operational,
  description: 'description',
  lifecycle: {
    startDate: 'startDate',
    status: database.availability.StatusEnum.STABLE,
  },
  name: 'engineCapabilitiesName',
  order: 1,
  sslModes: ['sslModes'],
  storage: database.capabilities.engine.storage.StrategyEnum.distributed,
  tags: [database.capabilities.Tags.current],
  versions: [
    {
      default: true,
      lifecycle: {
        startDate: 'startDate',
        status: database.availability.StatusEnum.STABLE,
      },
      name: 'versionName',
      tags: [database.capabilities.Tags.current],
    },
  ],
};

export const mockedRegionCapabilities: database.RegionCapabilities = {
  lifecycle: {
    startDate: 'startDate',
    status: database.availability.StatusEnum.STABLE,
  },
  name: 'regionCapabilities',
  order: 1,
  tags: [database.capabilities.Tags.current],
};

export const mockedFullCapabilities: FullCapabilities = {
  disks: ['disk1', 'disk2'],
  engines: [mockedEngineCapabilities],
  flavors: [mockedFlavor],
  options: [mockedOption],
  plans: [mockedPlan],
  regions: [mockedRegionCapabilities],
};
