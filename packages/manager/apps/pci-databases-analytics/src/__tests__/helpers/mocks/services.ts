import * as database from '@/types/cloud/project/database';
import { mockedNode } from './nodes';
import { ServiceCreationWithEngine } from '@/hooks/api/database/service/useAddService.hook';

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
  category: database.engine.CategoryEnum.all,
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
  backups: null,
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
  category: database.engine.CategoryEnum.all,
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

/// / Used for Add integration test
export const mockedServiceInteBase: database.Service = {
  backups: null,
  backupTime: 'backupTime',
  capabilities: {
    [database.service.CapabilityEnum.integrations]: {
      create: database.service.capability.StateEnum.enabled,
      update: database.service.capability.StateEnum.enabled,
      delete: database.service.capability.StateEnum.enabled,
      read: database.service.capability.StateEnum.enabled,
    },
  },
  category: database.engine.CategoryEnum.all,
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
  id: 'serviceBaseIdGrafanawith36caracteres',
  ipRestrictions: [
    {
      description: 'description',
      ip: 'ip',
      status: database.StatusEnum.READY,
    },
  ],
  maintenanceTime: 'maintenanceTime',
  networkId: 'networkId',
  networkType: database.NetworkTypeEnum.public,
  nodeNumber: 2,
  nodes: [mockedNode],
  plan: 'plan',
  region: 'region',
  status: database.StatusEnum.READY,
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

export const mockedServiceInteGraf: database.Service = {
  ...mockedServiceInteBase,
  id: 'serviceGrafBiswith36caracteres123456',
};

export const mockedServiceInteMySQL: database.Service = {
  ...mockedServiceInteBase,
  id: 'serviceMySQLWith36caracteres12345678',
  engine: database.EngineEnum.mysql,
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
};

export const mockedServiceInteM3DB: database.Service = {
  ...mockedServiceInteBase,
  id: 'serviceM3DBwith36caracteres123456789',
  engine: database.EngineEnum.m3db,
  endpoints: [
    {
      component: database.service.endpoint.ComponentEnum.m3coordinator,
      domain: 'domain',
      path: 'path',
      port: 1,
      scheme: 'scheme',
      ssl: true,
      sslMode: 'sslMode',
      uri: 'uri',
    },
  ],
};
