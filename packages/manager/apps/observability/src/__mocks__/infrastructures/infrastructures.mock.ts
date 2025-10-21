import { InfrastructuresParams, RetentionParams } from '@/data/api/infrastructures.props';
import { Infrastructure, Retention } from '@/types/infrastructures.type';

const infrastructures: Infrastructure[] = [
  {
    id: '3fa85f64-5717-4562-b3fc-2c963f66afa6',
    currentState: {
      location: 'eu-west-sbg',
      type: 'SHARED',
      usage: 'METRICS',
    },
  },
  {
    id: '6ee8fb35-2621-4530-a288-84fc0e85dac1',
    currentState: {
      location: 'eu-west-gra',
      type: 'SHARED',
      usage: 'METRICS',
    },
  },
  {
    id: '6ee8fb35-2621-4530-a288-84fc0e85bb1',
    currentState: {
      location: 'ca-east-bhs',
      type: 'SHARED',
      usage: 'METRICS',
    },
  },
  {
    id: '6ee8fb35-2621-2345-a288-84fc0e85bb1',
    currentState: {
      location: 'us-east-vin',
      type: 'SHARED',
      usage: 'METRICS',
    },
  },
  {
    id: '6ee8fb35-1111-2345-z288-84fc0e85bb1',
    currentState: {
      location: 'ap-southeast-sgp',
      type: 'SHARED',
      usage: 'METRICS',
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
