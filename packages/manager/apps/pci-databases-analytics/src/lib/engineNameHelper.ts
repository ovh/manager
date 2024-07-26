import * as database from '@/types/cloud/project/database';

export function humanizeEngine(engine: database.EngineEnum) {
  switch (engine) {
    case database.EngineEnum.cassandra:
      return 'Cassandra';
    case database.EngineEnum.grafana:
      return 'Grafana';
    case database.EngineEnum.kafka:
      return 'Kafka';
    case database.EngineEnum.kafkaConnect:
      return 'Kafka Connect';
    case database.EngineEnum.kafkaMirrorMaker:
      return 'Kafka MirrorMaker';
    case database.EngineEnum.m3aggregator:
      return 'M3 Aggregator';
    case database.EngineEnum.m3db:
      return 'M3DB';
    case database.EngineEnum.mongodb:
      return 'MongoDB';
    case database.EngineEnum.mysql:
      return 'MySQL';
    case database.EngineEnum.opensearch:
      return 'OpenSearch';
    case database.EngineEnum.postgresql:
      return 'PostgreSQL';
    case database.EngineEnum.redis:
      return 'Caching';
    default:
      return engine;
  }
}
