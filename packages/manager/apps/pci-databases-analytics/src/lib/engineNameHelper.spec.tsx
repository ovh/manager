import { describe, it, expect } from 'vitest';
import * as database from '@/types/cloud/project/database';
import { humanizeEngine } from '@/lib/engineNameHelper';

type EngineTestCase = [database.EngineEnum | string, string];

const testCases: EngineTestCase[] = [
  [database.EngineEnum.cassandra, 'Cassandra'],
  [database.EngineEnum.grafana, 'Grafana'],
  [database.EngineEnum.kafka, 'Kafka'],
  [database.EngineEnum.kafkaConnect, 'Kafka Connect'],
  [database.EngineEnum.kafkaMirrorMaker, 'Kafka MirrorMaker'],
  [database.EngineEnum.m3aggregator, 'M3 Aggregator'],
  [database.EngineEnum.m3db, 'M3DB'],
  [database.EngineEnum.mongodb, 'MongoDB'],
  [database.EngineEnum.mysql, 'MySQL'],
  [database.EngineEnum.opensearch, 'OpenSearch'],
  [database.EngineEnum.postgresql, 'PostgreSQL'],
  [database.EngineEnum.redis, 'Caching'],
  // Including a case for an engine not defined in the enum to test the default case
  ['someUnknownEngine', 'someUnknownEngine'],
];

describe('humanizeEngine', () => {
  it.each(testCases)(
    'should return correct human-readable engine name for %s',
    (engine, expected) => {
      const result = humanizeEngine(engine as database.EngineEnum);
      expect(result).toBe(expected);
    },
  );
});
