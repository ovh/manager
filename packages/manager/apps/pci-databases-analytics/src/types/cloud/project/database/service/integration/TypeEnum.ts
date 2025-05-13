/** Possible type of the service integration */
export enum TypeEnum {
  'grafanaDashboard' = 'grafanaDashboard',
  'grafanaDatasource' = 'grafanaDatasource',
  'kafkaConnect' = 'kafkaConnect',
  'kafkaLogs' = 'kafkaLogs',
  'kafkaMirrorMaker' = 'kafkaMirrorMaker',
  'm3aggregator' = 'm3aggregator',
  'm3dbMetrics' = 'm3dbMetrics',
  'opensearchLogs' = 'opensearchLogs',
  'postgresqlMetrics' = 'postgresqlMetrics',
}
