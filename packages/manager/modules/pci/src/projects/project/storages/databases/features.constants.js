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
  ],
  backupTab: [
    DATABASE_TYPES.MONGO_DB,
    DATABASE_TYPES.MYSQL,
    DATABASE_TYPES.POSTGRESQL,
    DATABASE_TYPES.REDIS,
    DATABASE_TYPES.OPEN_SEARCH,
  ],
  restoreFromBackup: [DATABASE_TYPES.MONGO_DB],
  aclTab: [DATABASE_TYPES.KAFKA],
  topicsTab: [DATABASE_TYPES.KAFKA],
  getRoles: [DATABASE_TYPES.MONGO_DB, DATABASE_TYPES.POSTGRESQL],
  showKey: [DATABASE_TYPES.KAFKA],
  showCert: [DATABASE_TYPES.KAFKA],
  showUserInformations: [DATABASE_TYPES.REDIS],
  indexesTab: [DATABASE_TYPES.OPEN_SEARCH],
};

export default function isFeatureActivated(feature, databaseType) {
  return includes(features[feature], databaseType);
}
