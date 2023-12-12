import { database } from '@/models/database';

export const getServiceType = (engine: string) => {
  let type = database.ServiceTypeEnum.databases;
  switch (engine) {
    case 'mongodb':
    case 'postgresql':
    case 'mysql':
    case 'redis':
    case 'cassandra':
    case 'm3db':
    case 'm3aggregator':
      type = database.ServiceTypeEnum.databases;
      break;
    case 'opensearch':
    case 'grafana':
      type = database.ServiceTypeEnum['data-analysis'];
      break;
    case 'kafkaMirrorMaker':
    case 'kafkaConnect':
    case 'kafka':
      type = database.ServiceTypeEnum['data-streaming'];
      break;
    default:
      type = database.ServiceTypeEnum.databases;
      break;
  }
  return type;
};
