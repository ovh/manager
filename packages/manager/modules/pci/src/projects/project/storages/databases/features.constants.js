import includes from 'lodash/includes';
import { DATABASE_TYPES } from './databases.constants';

const features = {
  databaseTab: [DATABASE_TYPES.MYSQL, DATABASE_TYPES.POSTGRESQL],
  certificate: [
    DATABASE_TYPES.MYSQL,
    DATABASE_TYPES.POSTGRESQL,
    DATABASE_TYPES.KAFKA,
  ],
  usersTab: [
    DATABASE_TYPES.MONGO_DB,
    DATABASE_TYPES.MYSQL,
    DATABASE_TYPES.POSTGRESQL,
    DATABASE_TYPES.KAFKA,
    DATABASE_TYPES.REDIS,
    DATABASE_TYPES.OPEN_SEARCH,
    DATABASE_TYPES.M3DB,
  ],
  backupTab: [
    DATABASE_TYPES.MONGO_DB,
    DATABASE_TYPES.MYSQL,
    DATABASE_TYPES.POSTGRESQL,
    DATABASE_TYPES.REDIS,
    DATABASE_TYPES.OPEN_SEARCH,
    DATABASE_TYPES.M3DB,
    DATABASE_TYPES.GRAFANA,
  ],
  showSSL: [
    DATABASE_TYPES.MONGO_DB,
    DATABASE_TYPES.MYSQL,
    DATABASE_TYPES.POSTGRESQL,
    DATABASE_TYPES.KAFKA,
    DATABASE_TYPES.REDIS,
  ],
  port: [
    DATABASE_TYPES.MONGO_DB,
    DATABASE_TYPES.MYSQL,
    DATABASE_TYPES.POSTGRESQL,
    DATABASE_TYPES.KAFKA,
    DATABASE_TYPES.REDIS,
    DATABASE_TYPES.OPEN_SEARCH,
    DATABASE_TYPES.M3DB,
    DATABASE_TYPES.GRAFANA,
  ],
  host: [
    DATABASE_TYPES.MONGO_DB,
    DATABASE_TYPES.MYSQL,
    DATABASE_TYPES.POSTGRESQL,
    DATABASE_TYPES.KAFKA,
    DATABASE_TYPES.REDIS,
    DATABASE_TYPES.OPEN_SEARCH,
    DATABASE_TYPES.M3DB,
    DATABASE_TYPES.GRAFANA,
  ],
  serviceURI: [
    DATABASE_TYPES.MONGO_DB,
    DATABASE_TYPES.MYSQL,
    DATABASE_TYPES.POSTGRESQL,
    DATABASE_TYPES.KAFKA,
    DATABASE_TYPES.REDIS,
    DATABASE_TYPES.OPEN_SEARCH,
    DATABASE_TYPES.GRAFANA,
  ],
  hideMiddleColumn: [DATABASE_TYPES.KAFKA_MIRROR_MAKER],
  allowedIpsTab: [
    DATABASE_TYPES.MONGO_DB,
    DATABASE_TYPES.MYSQL,
    DATABASE_TYPES.POSTGRESQL,
    DATABASE_TYPES.KAFKA,
    DATABASE_TYPES.REDIS,
    DATABASE_TYPES.OPEN_SEARCH,
    DATABASE_TYPES.M3DB,
    DATABASE_TYPES.GRAFANA,
  ],
  poolsTab: [DATABASE_TYPES.POSTGRESQL],
  showKibanaURI: [DATABASE_TYPES.OPEN_SEARCH],
  queryStatisticsTab: [DATABASE_TYPES.MYSQL, DATABASE_TYPES.POSTGRESQL],
  restoreFromBackup: [DATABASE_TYPES.MONGO_DB],
  aclTab: [DATABASE_TYPES.KAFKA],
  userAclTab: [DATABASE_TYPES.OPEN_SEARCH],
  topicsTab: [DATABASE_TYPES.KAFKA],
  currentQueriesTab: [DATABASE_TYPES.MYSQL, DATABASE_TYPES.POSTGRESQL],
  getRoles: [DATABASE_TYPES.MONGO_DB, DATABASE_TYPES.POSTGRESQL],
  showKey: [DATABASE_TYPES.KAFKA],
  showCert: [DATABASE_TYPES.KAFKA],
  showUserInformations: [DATABASE_TYPES.REDIS],
  indexesTab: [DATABASE_TYPES.OPEN_SEARCH],
  serviceIntegrationTab: [DATABASE_TYPES.KAFKA_MIRROR_MAKER],
  replicationsTab: [DATABASE_TYPES.KAFKA_MIRROR_MAKER],
  showServiceIntegration: [DATABASE_TYPES.KAFKA],
  restApi: [DATABASE_TYPES.KAFKA],
  resetAdminUserFromDashboard: [DATABASE_TYPES.GRAFANA],
};

export default function isFeatureActivated(feature, databaseType) {
  return includes(features[feature], databaseType);
}
