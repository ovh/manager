import * as database from '@/types/cloud/project/database';

export const mockedNodeUpdate: database.service.Node = {
  createdAt: '2020/01/01',
  flavor: 'db1-4',
  id: 'nodeId',
  name: 'nodeName',
  port: 8080,
  region: 'gra',
  role: database.service.node.RoleEnum.ANALYTICS,
  status: database.StatusEnum.READY,
};

export const mockedServiceToUpdate: database.Service = {
  backupTime: '16:00:00',
  capabilities: {
    [database.service.CapabilityEnum.backups]: {
      create: database.service.capability.StateEnum.enabled,
    },
    [database.service.CapabilityEnum.currentQueries]: {
      create: database.service.capability.StateEnum.enabled,
    },
    [database.service.CapabilityEnum.databases]: {
      create: database.service.capability.StateEnum.enabled,
    },
    [database.service.CapabilityEnum.namespaces]: {
      create: database.service.capability.StateEnum.enabled,
    },
    [database.service.CapabilityEnum.integrations]: {
      create: database.service.capability.StateEnum.enabled,
    },
    [database.service.CapabilityEnum.queryStatistics]: {
      create: database.service.capability.StateEnum.enabled,
    },
    [database.service.CapabilityEnum.users]: {
      create: database.service.capability.StateEnum.enabled,
    },
    [database.service.CapabilityEnum.advancedConfiguration]: {
      create: database.service.capability.StateEnum.enabled,
    },
    [database.service.CapabilityEnum.connectionPools]: {
      create: database.service.capability.StateEnum.enabled,
    },
    [database.service.CapabilityEnum.maintenanceApply]: {
      create: database.service.capability.StateEnum.enabled,
    },
    [database.service.CapabilityEnum.service]: {
      delete: database.service.capability.StateEnum.enabled,
      update: database.service.capability.StateEnum.enabled,
    },
  },
  category: database.engine.CategoryEnum.operational,
  createdAt: '12/12/2022',
  description: 'serviceToUpdate',
  disk: {
    size: 1,
    type: 'type',
  },
  endpoints: [
    {
      component: database.service.endpoint.ComponentEnum.mysql,
      domain: 'domain',
      path: 'path',
      port: 1,
      scheme: 'scheme',
      ssl: true,
      sslMode: 'sslMode',
      uri: 'uri',
    },
  ],
  engine: database.EngineEnum.mysql,
  flavor: 'db1-4',
  id: 'serviceToUpdateId',
  ipRestrictions: [
    {
      description: 'description',
      ip: 'ip',
      status: database.StatusEnum.CREATING,
    },
  ],
  maintenanceTime: '15:00:00',
  networkType: database.NetworkTypeEnum.public,
  nodeNumber: 2,
  nodes: [mockedNodeUpdate],
  plan: 'business',
  status: database.StatusEnum.READY,
  storage: {
    size: {
      unit: 'GB',
      value: 30,
    },
    type: 'type',
  },
  version: '7',
};

export const mockedAvailabilitiesFlavor: database.Availability = {
  backup: database.BackupTypeEnum.automatic,
  backupRetentionDays: 3,
  backups: {
    available: true,
    retentionDays: 3,
  },
  category: database.engine.CategoryEnum.operational,
  default: true,
  engine: database.EngineEnum.mysql,
  flavor: 'db1-4',
  lifecycle: {
    startDate: '1999/04/08',
    status: database.availability.StatusEnum.STABLE,
  },
  plan: 'business',
  region: 'gra',
  specifications: {
    flavor: 'db1-4',
    network: database.NetworkTypeEnum.public,
    nodes: {
      maximum: 5,
      minimum: 1,
    },
    storage: {
      maximum: {
        unit: 'GB',
        value: 100,
      },
      minimum: {
        unit: 'GB',
        value: 40,
      },
      step: {
        unit: 'GB',
        value: 20,
      },
    },
  },
  version: '7',
  maxDiskSize: 100,
  maxNodeNumber: 5,
  minDiskSize: 400,
  minNodeNumber: 1,
  network: database.NetworkTypeEnum.public,
  startDate: '1999/04/08',
  status: database.availability.StatusEnum.STABLE,
  stepDiskSize: 20,
  planCode: '',
  planCodeStorage: '',
};
export const mockedAvailabilitiesFlavorBis: database.Availability = {
  ...mockedAvailabilitiesFlavor,
  default: false,
  flavor: 'db1-7',
  lifecycle: {
    startDate: '2001/04/08',
    status: database.availability.StatusEnum.STABLE,
  },
  plan: 'business',
  region: 'gra',
  specifications: {
    flavor: 'db1-7',
    network: database.NetworkTypeEnum.public,
    nodes: {
      maximum: 6,
      minimum: 2,
    },
    storage: {
      maximum: {
        unit: 'GB',
        value: 200,
      },
      minimum: {
        unit: 'GB',
        value: 40,
      },
      step: {
        unit: 'GB',
        value: 20,
      },
    },
  },
  startDate: '2001/04/08',
  version: '7',
  maxDiskSize: 200,
  maxNodeNumber: 6,
  minDiskSize: 40,
  minNodeNumber: 2,
  stepDiskSize: 20,
};

export const mockedAvailabilitiesFlavorTer: database.Availability = {
  ...mockedAvailabilitiesFlavor,
  default: false,
  flavor: 'db1-4',
  lifecycle: {
    startDate: '2001/04/08',
    status: database.availability.StatusEnum.STABLE,
  },
  plan: 'enterprise',
  region: 'gra',
  specifications: {
    flavor: 'db1-4',
    network: database.NetworkTypeEnum.public,
    nodes: {
      maximum: 6,
      minimum: 2,
    },
    storage: {
      maximum: {
        unit: 'GB',
        value: 200,
      },
      minimum: {
        unit: 'GB',
        value: 40,
      },
      step: {
        unit: 'GB',
        value: 20,
      },
    },
  },
  startDate: '2001/04/08',
  version: '7',
  maxDiskSize: 200,
  maxNodeNumber: 6,
  minDiskSize: 40,
  minNodeNumber: 2,
  stepDiskSize: 20,
};

export const mockedAvailabilitiesVersion: database.Availability = {
  ...mockedAvailabilitiesFlavor,
  default: false,
  version: '8',
};

export const mockedSuggestionsUpdate: database.availability.Suggestion = {
  default: true,
  engine: database.EngineEnum.mysql,
  flavor: 'db1-4',
  plan: 'business',
  region: 'gra',
  version: '7',
};

export const mockedEngineCapabilitiesUpdate: database.capabilities.EngineCapabilities = {
  category: database.engine.CategoryEnum.operational,
  description: 'engineUpdate',
  lifecycle: {
    startDate: 'startDate',
    status: database.availability.StatusEnum.STABLE,
  },
  name: database.EngineEnum.mysql,
  order: 1,
  sslModes: ['sslModes'],
  storage: database.capabilities.engine.storage.StrategyEnum.distributed,
  tags: [],
  versions: [
    {
      default: true,
      lifecycle: {
        startDate: '2020/01/01',
        status: database.availability.StatusEnum.STABLE,
      },
      name: '7',
      tags: [],
    },
    {
      default: false,
      lifecycle: {
        startDate: '2020/01/01',
        status: database.availability.StatusEnum.STABLE,
      },
      name: '8',
      tags: [],
    },
  ],
};

export const mockedEngineUpdate: database.capabilities.Engine = {
  category: database.engine.CategoryEnum.operational,
  defaultVersion: '7',
  description: 'description',
  name: database.EngineEnum.mysql,
  sslModes: ['sslModes'],
  storage: database.capabilities.engine.storage.StrategyEnum.distributed,
  versions: ['7'],
};

export const mockedFlavorUpdate: database.capabilities.Flavor = {
  core: 3,
  lifecycle: {
    startDate: '2020/01/01',
    status: database.availability.StatusEnum.STABLE,
  },
  memory: 3,
  name: 'db1-4',
  order: 1,
  specifications: {
    core: 3,
    memory: {
      unit: 'unit',
      value: 3,
    },
    storage: {
      unit: 'unit',
      value: 250,
    },
  },
  storage: 250,
  tags: [],
};

export const mockedFlavorUpdateBis: database.capabilities.Flavor = {
  ...mockedFlavorUpdate,
  order: 2,
  name: 'db1-7',
  core: 5,
  memory: 5,

  lifecycle: {
    startDate: '2020/01/01',
    status: database.availability.StatusEnum.STABLE,
  },
  specifications: {
    core: 5,
    memory: {
      unit: 'unit',
      value: 5,
    },
    storage: {
      unit: 'unit',
      value: 400,
    },
  },
  storage: 400,
};

export const mockedOptionUpdate: database.capabilities.Option = {
  name: 'optionNameUpdate',
  type: database.TypeEnum.boolean,
};

export const mockedPlanUpdate: database.capabilities.Plan = {
  backupRetention: 'backupRetention',
  description: 'description',
  lifecycle: {
    startDate: '2020/01/01',
    status: database.availability.StatusEnum.STABLE,
  },
  name: 'business',
  order: 1,
  tags: [],
};

export const mockedPlanUpdateBis: database.capabilities.Plan = {
  ...mockedPlanUpdate,
  order: 2,
  name: 'enterprise',
  tags: [],
};

export const mockedRegionCapabilitiesUpdate: database.capabilities.RegionCapabilities = {
  lifecycle: {
    startDate: '2020/02/20',
    status: database.availability.StatusEnum.STABLE,
  },
  name: 'gra',
  order: 1,
  tags: [],
};
