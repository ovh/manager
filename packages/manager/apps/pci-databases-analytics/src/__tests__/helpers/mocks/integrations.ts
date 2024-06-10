import { database } from '@/models/database';

export const mockedIntegrations: database.service.Integration = {
  destinationServiceId: 'destinationServiceId',
  id: 'integrationId',
  sourceServiceId: 'serviceId',
  status: database.service.integration.StatusEnum.READY,
  type: database.service.integration.TypeEnum.kafkaConnect,
};

export const mockedCapabilitiesIntegrations: database.capabilities.Integration = {
  destinationEngine: database.EngineEnum.mongodb,
  sourceEngine: database.EngineEnum.m3db,
  type: database.service.integration.TypeEnum.kafkaMirrorMaker,
};

// used for Add integration test///
export const mockedCapaInteGrafDash: database.capabilities.Integration = {
  destinationEngine: database.EngineEnum.grafana,
  sourceEngine: database.EngineEnum.m3db,
  type: database.service.integration.TypeEnum.grafanaDashboard,
};

export const mockedCapaInteGrafData: database.capabilities.Integration = {
  destinationEngine: database.EngineEnum.mysql,
  sourceEngine: database.EngineEnum.grafana,
  type: database.service.integration.TypeEnum.grafanaDatasource,
};

export const mockedCapaInteGrafOpen: database.capabilities.Integration = {
  destinationEngine: database.EngineEnum.grafana,
  sourceEngine: database.EngineEnum.grafana,
  type: database.service.integration.TypeEnum.opensearchLogs,
};
/// /////////////////////////////////////

export const mockedAddIntegrations: Omit<
  database.service.Integration,
  'id' | 'status'
> = {
  destinationServiceId: 'destinationServiceId',
  sourceServiceId: 'sourceServiceId',
  type: database.service.integration.TypeEnum.kafkaConnect,
};
