import { database } from '@/models/database';

export const getServiceType = (engine: database.EngineEnum) => {
  let type = database.ServiceTypeEnum.databases;
  switch (engine) {
    case database.EngineEnum.mongodb:
    case database.EngineEnum.postgresql:
    case database.EngineEnum.mysql:
    case database.EngineEnum.redis:
    case database.EngineEnum.cassandra:
    case database.EngineEnum.m3db:
    case database.EngineEnum.m3aggregator:
      type = database.ServiceTypeEnum.databases;
      break;
    case database.EngineEnum.opensearch:
    case database.EngineEnum.grafana:
      type = database.ServiceTypeEnum['data-analysis'];
      break;
    case database.EngineEnum.kafkaMirrorMaker:
    case database.EngineEnum.kafkaConnect:
    case database.EngineEnum.kafka:
      type = database.ServiceTypeEnum['data-streaming'];
      break;
    default:
      type = database.ServiceTypeEnum.databases;
      break;
  }
  return type;
};
