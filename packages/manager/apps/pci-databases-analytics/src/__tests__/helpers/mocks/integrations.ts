import { database } from '@/models/database';

export const mockedIntegrations: database.service.Integration = {
  destinationServiceId: 'destinationServiceId',
  id: 'integrationId',
  sourceServiceId: 'sourceServiceId',
  status: database.service.integration.StatusEnum.READY,
  type: database.service.integration.TypeEnum.kafkaConnect,
};

export const mockedCapabilitiesIntegrations: database.capabilities.Integration = {
  destinationEngine: database.EngineEnum.mongodb,
  sourceEngine: database.EngineEnum.m3db,
  type: database.service.integration.TypeEnum.kafkaMirrorMaker,
};

export const mockedAddIntegrations: Omit<
  database.service.Integration,
  'id' | 'status'
> = {
  destinationServiceId: 'destinationServiceId',
  sourceServiceId: 'sourceServiceId',
  type: database.service.integration.TypeEnum.kafkaConnect,
};
