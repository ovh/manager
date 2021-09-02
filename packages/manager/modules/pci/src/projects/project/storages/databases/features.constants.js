import includes from 'lodash/includes';
import { DATABASE_TYPES } from './databases.constants';

const features = {
  databaseTab: [DATABASE_TYPES.MYSQL, DATABASE_TYPES.POSTGRESQL],
  certificate: [
    DATABASE_TYPES.MYSQL,
    DATABASE_TYPES.POSTGRESQL,
    DATABASE_TYPES.KAFKA,
  ],
  replicateURI: [DATABASE_TYPES.MONGO_DB],
  usersTab: [
    DATABASE_TYPES.MONGO_DB,
    DATABASE_TYPES.MYSQL,
    DATABASE_TYPES.POSTGRESQL,
    DATABASE_TYPES.KAFKA,
    DATABASE_TYPES.REDIS,
  ],
  backupTab: [
    DATABASE_TYPES.MONGO_DB,
    DATABASE_TYPES.KAFKA,
    DATABASE_TYPES.MYSQL,
    DATABASE_TYPES.POSTGRESQL,
    DATABASE_TYPES.REDIS,
  ],
  aclTab: [DATABASE_TYPES.KAFKA],
  topicsTab: [DATABASE_TYPES.KAFKA],
  getRoles: [DATABASE_TYPES.MONGO_DB, DATABASE_TYPES.POSTGRESQL],
};

export default function isFeatureActivated(feature, databaseType) {
  return includes(features[feature], databaseType);
}
