import { database } from '@/models/database';
import { mockedNode } from './nodes';
import { ServiceCreationWithEngine } from '@/hooks/api/services.api.hooks';

export const mockedService: database.Service = {
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
  category: database.CategoryEnum.all,
  createdAt: '12/12/2022',
  description: 'serviceDescription',
  disk: {
    size: 1,
    type: 'type',
  },
  endpoints: [
    {
      component: database.service.endpoint.ComponentEnum.mongodb,
      domain: 'domain',
      path: 'path',
      port: 1,
      scheme: 'scheme',
      ssl: true,
      sslMode: 'sslMode',
      uri: 'uri',
    },
  ],
  engine: database.EngineEnum.mongodb,
  flavor: 'flavor',
  id: 'serviceId',
  ipRestrictions: [
    {
      description: 'description',
      ip: 'ip',
      status: database.StatusEnum.CREATING,
    },
  ],
  maintenanceTime: '15:00:00',
  networkId: 'networkId',
  networkType: database.NetworkTypeEnum.private,
  nodeNumber: 2,
  nodes: [mockedNode],
  plan: 'plan',
  region: 'region',
  status: database.StatusEnum.CREATING,
  storage: {
    size: {
      unit: 'GB',
      value: 3,
    },
    type: 'type',
  },
  subnetId: 'subnetId',
  version: 'version',
  backups: {
    pitr: 'pitr',
    regions: ['GRA'],
    retentionDays: 10,
    time: '16:00:00',
  },
};

export const mockedServiceInte: database.Service = {
  backupTime: 'backupTime',
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
  },
  category: database.CategoryEnum.all,
  createdAt: 'createdAt',
  description: 'description',
  disk: {
    size: 1,
    type: 'type',
  },
  endpoints: [
    {
      component: database.service.endpoint.ComponentEnum.grafana,
      domain: 'domain',
      path: 'path',
      port: 1,
      scheme: 'scheme',
      ssl: true,
      sslMode: 'sslMode',
      uri: 'uri',
    },
  ],
  engine: database.EngineEnum.grafana,
  flavor: 'flavor',
  id: 'destinationServiceId',
  ipRestrictions: [
    {
      description: 'description',
      ip: 'ip',
      status: database.StatusEnum.READY,
    },
  ],
  maintenanceTime: 'maintenanceTime',
  networkId: 'networkId',
  networkType: database.NetworkTypeEnum.private,
  nodeNumber: 2,
  nodes: [mockedNode],
  plan: 'plan',
  region: 'region',
  status: database.StatusEnum.CREATING,
  storage: {
    size: {
      unit: 'unit',
      value: 3,
    },
    type: 'type',
  },
  subnetId: 'subnetId',
  version: 'version',
};

export const mockedForkService: database.Service = {
  ...mockedService,
  id: 'serviceIdWith36caractèresForForkings',
};

export const mockedServiceCreation: database.ServiceCreation = {
  description: 'description',
  ipRestrictions: [
    {
      description: 'description',
      ip: 'id',
      status: database.StatusEnum.CREATING,
    },
  ],
  maintenanceTime: 'maintenanceTime',
  networkId: 'networkId',
  plan: 'plan',
  subnetId: 'subnetId',
  version: 'version',
};

export const mockedServiceCreationWithEngine: ServiceCreationWithEngine = {
  ...mockedServiceCreation,
  engine: database.EngineEnum.mongodb,
};
