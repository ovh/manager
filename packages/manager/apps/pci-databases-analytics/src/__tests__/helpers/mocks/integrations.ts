import * as database from '@/types/cloud/project/database';

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
  parameters: [
    {
      name: 'paramaters',
      type: database.capabilities.integration.parameter.TypeEnum.string,
    },
  ],
};

// used for Add integration test///
export const mockedCapaInteGrafDash: database.capabilities.Integration = {
  destinationEngine: database.EngineEnum.grafana,
  sourceEngine: database.EngineEnum.m3db,
  type: database.service.integration.TypeEnum.grafanaDashboard,
  parameters: [
    {
      name: 'paramaters',
      type: database.capabilities.integration.parameter.TypeEnum.string,
    },
  ],
};

export const mockedCapaInteGrafData: database.capabilities.Integration = {
  destinationEngine: database.EngineEnum.mysql,
  sourceEngine: database.EngineEnum.grafana,
  type: database.service.integration.TypeEnum.grafanaDatasource,
  parameters: [
    {
      name: 'paramaters',
      type: database.capabilities.integration.parameter.TypeEnum.string,
    },
    {
      name: 'number',
      type: database.capabilities.integration.parameter.TypeEnum.integer,
    },
  ],
};

export const mockedCapaInteGrafOpen: database.capabilities.Integration = {
  destinationEngine: database.EngineEnum.grafana,
  sourceEngine: database.EngineEnum.grafana,
  type: database.service.integration.TypeEnum.opensearchLogs,
  parameters: [
    {
      name: 'paramaters',
      type: database.capabilities.integration.parameter.TypeEnum.string,
    },
  ],
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
