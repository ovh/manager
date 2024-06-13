export const ENGINES_STATUS = {
  BETA: 'BETA',
  STABLE: 'STABLE',
  UNAVAILABLE: 'UNAVAILABLE',
  DEPRECATED: 'DEPRECATED',
  END_OF_SALE: 'END_OF_SALE',
  END_OF_LIFE: 'END_OF_LIFE',
};

export const ENGINES_PRICE_SUFFIX = {
  BETA: 'beta',
};

export const ENGINES_NAMES = {
  mysql: 'MySQL',
  mongodb: 'MongoDB',
  postgresql: 'PostgreSQL',
  kafka: 'Kafka',
  redis: 'Caching',
  opensearch: 'OpenSearch',
  kafkaMirrorMaker: 'Kafka MirrorMaker',
  kafkaConnect: 'Kafka Connect',
  m3db: 'M3DB',
  cassandra: 'Cassandra',
  grafana: 'Grafana',
  m3aggregator: 'M3 Aggregator',
};

export const ENGINES_STORAGE_MODES = {
  distributed: 'distributed',
  replicated: 'replicated',
};

export default {
  ENGINES_STATUS,
  ENGINES_PRICE_SUFFIX,
  ENGINES_NAMES,
  ENGINES_STORAGE_MODES,
};
