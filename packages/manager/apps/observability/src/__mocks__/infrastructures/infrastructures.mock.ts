import { InfrastructuresParams, RetentionParams } from '@/data/api/infrastructures.props';
import { Infrastructure, Retention } from '@/types/infrastructures.type';

const defaultExtraSettings = {
  mimir: {
    configurable: {
      compactor_blocks_retention_period: {
        default: '30d',
        min: '7d',
        max: '400d',
        type: 'DURATION' as const,
      },
      max_global_series_per_user: {
        default: 1000000,
        min: 100000,
        max: 10000000,
        type: 'NUMERIC' as const,
      },
    },
  },
};

const infrastructures: Infrastructure[] = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    currentState: {
      location: 'eu-west-sbg',
      type: 'SHARED',
      usage: 'METRICS',
      entryPoint: 'eee.metrics.ovh.com',
      extraSettings: defaultExtraSettings,
    },
  },
  {
    id: '6ee8fb35-2621-4530-a288-84fc0e85dac1',
    currentState: {
      location: 'eu-west-gra',
      type: 'SHARED',
      usage: 'METRICS',
      entryPoint: 'aaa.metrics.ovh.com',
      extraSettings: defaultExtraSettings,
    },
  },
  {
    id: '6ee8fb35-2621-4530-a288-84fc0e85bb1',
    currentState: {
      location: 'ca-east-bhs',
      type: 'SHARED',
      usage: 'METRICS',
      entryPoint: 'bbb.metrics.ovh.com',
      extraSettings: defaultExtraSettings,
    },
  },
  {
    id: '6ee8fb35-2621-2345-a288-84fc0e85bb1',
    currentState: {
      location: 'us-east-vin',
      type: 'SHARED',
      usage: 'METRICS',
      entryPoint: 'ccc.metrics.ovh.com',
      extraSettings: defaultExtraSettings,
    },
  },
  {
    id: '6ee8fb35-1111-2345-z288-84fc0e85bb1',
    currentState: {
      location: 'ap-southeast-sgp',
      type: 'SHARED',
      usage: 'METRICS',
      entryPoint: 'ddd.metrics.ovh.com',
      extraSettings: defaultExtraSettings,
    },
  },
];

export const getInfrastructures = async ({
  resourceName,
  usages,
  types,
}: InfrastructuresParams): Promise<Infrastructure[]> => {
  console.info(`[MOCK-ADAPTER][getInfrastructures] infrastructures mock for ${resourceName}`, {
    usages,
    types,
    infrastructures,
  });
  return Promise.resolve(infrastructures);
};

const retentions: Retention[] = [
  {
    id: '1',
    duration: 'P1M',
    default: true,
    supported: true,
  },
  {
    id: '2',
    duration: 'P3M',
    default: false,
    supported: true,
  },
  {
    id: '3',
    duration: 'P6M',
    default: false,
    supported: true,
  },
  {
    id: '4',
    duration: 'P1Y',
    default: false,
    supported: true,
  },
];

export const getRetentions = async ({
  resourceName,
  infrastructureId,
}: RetentionParams): Promise<Retention[]> => {
  console.info(`[MOCK-ADAPTER][getRetentions] retentions mock for ${resourceName}`, {
    infrastructureId,
    retentions,
  });
  return Promise.resolve(retentions);
};
