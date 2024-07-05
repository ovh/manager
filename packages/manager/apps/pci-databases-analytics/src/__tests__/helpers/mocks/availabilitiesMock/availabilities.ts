import * as database from '@/types/cloud/project/database';

const mockedLifecycle = {
  startDate: '',
  status: database.availability.StatusEnum.STABLE,
};

const mongo: database.Availability[] = [
  {
    engine: 'mongodb',
    version: '6',
    plan: 'discovery',
    specifications: {
      storage: {
        minimum: { value: 512, unit: 'MB' },
        maximum: { value: 512, unit: 'MB' },
      },
      flavor: 'free',
      network: database.NetworkTypeEnum.public,
      nodes: {
        minimum: 1,
        maximum: 1,
      },
    },
    backups: {
      available: false,
    },
    category: database.engine.CategoryEnum.operational,
    lifecycle: mockedLifecycle,
    region: 'GRA',
    default: false,
  },
  {
    engine: 'mongodb',
    version: '6',
    plan: 'essential',
    specifications: {
      storage: {
        minimum: { value: 500, unit: 'GB' },
        maximum: { value: 1000, unit: 'GB' },
        step: { value: 10, unit: 'GB' },
      },
      flavor: 'db2',
      network: database.NetworkTypeEnum.public,
      nodes: {
        minimum: 2,
        maximum: 5,
      },
    },
    backups: {
      available: true,
      retentionDays: 3,
    },
    category: database.engine.CategoryEnum.operational,
    lifecycle: mockedLifecycle,
    region: 'GRA',
    default: false,
  },
  {
    engine: 'mongodb',
    version: '6',
    plan: 'essential',
    specifications: {
      storage: {
        minimum: { value: 100, unit: 'GB' },
        maximum: { value: 500, unit: 'GB' },
        step: { value: 10, unit: 'GB' },
      },
      flavor: 'db1',
      network: database.NetworkTypeEnum.public,
      nodes: {
        minimum: 3,
        maximum: 3,
      },
    },
    backups: {
      available: true,
      retentionDays: 3,
    },
    category: database.engine.CategoryEnum.operational,
    lifecycle: mockedLifecycle,
    region: 'GRA',
    default: false,
  },
  {
    engine: 'mongodb',
    version: '6',
    plan: 'essential',
    specifications: {
      storage: {
        minimum: { value: 500, unit: 'GB' },
        maximum: { value: 1000, unit: 'GB' },
        step: { value: 10, unit: 'GB' },
      },
      flavor: 'db3',
      network: database.NetworkTypeEnum.public,
      nodes: {
        minimum: 1,
        maximum: 8,
      },
    },
    backups: {
      available: true,
      retentionDays: 3,
    },
    category: database.engine.CategoryEnum.operational,
    lifecycle: mockedLifecycle,
    region: 'GRA',
    default: false,
  },
];

const pg: database.Availability[] = [
  {
    engine: 'postgresql',
    version: '4',
    plan: 'essential',
    specifications: {
      storage: {
        minimum: { value: 200, unit: 'GB' },
        maximum: { value: 600, unit: 'GB' },
        step: { value: 10, unit: 'GB' },
      },
      flavor: 'db1',
      network: database.NetworkTypeEnum.private,
      nodes: {
        minimum: 3,
        maximum: 3,
      },
    },
    backups: {
      available: true,
      retentionDays: 3,
    },
    category: database.engine.CategoryEnum.operational,
    lifecycle: mockedLifecycle,
    region: 'GRA',
    default: false,
  },
  {
    engine: 'postgresql',
    version: '4',
    plan: 'essential',
    specifications: {
      storage: {
        minimum: { value: 200, unit: 'GB' },
        maximum: { value: 600, unit: 'GB' },
        step: { value: 10, unit: 'GB' },
      },
      flavor: 'db1',
      network: database.NetworkTypeEnum.private,
      nodes: {
        minimum: 3,
        maximum: 3,
      },
    },
    backups: {
      available: true,
      retentionDays: 3,
    },
    category: database.engine.CategoryEnum.operational,
    lifecycle: mockedLifecycle,
    region: 'GRA',
    default: false,
  },
];

const grafana = [
  {
    engine: 'grafana',
    version: '1',
    plan: 'essential',
    specifications: {
      flavor: 'db1',
      network: database.NetworkTypeEnum.private,
      nodes: {
        minimum: 3,
        maximum: 3,
      },
    },
    backups: {
      available: true,
      retentionDays: 3,
    },
    category: database.engine.CategoryEnum.operational,
    lifecycle: mockedLifecycle,
    region: 'GRA',
    default: false,
  },
];

export const mockedAvailabilities: database.Availability[] = [
  ...mongo,
  ...pg,
  ...grafana,
];
