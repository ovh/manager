import includes from 'lodash/includes';
import { DATABASE_TYPES } from './databases.constants';

const features = {
  databaseTabs: [DATABASE_TYPES.MYSQL, DATABASE_TYPES.POSTGRESQL],
  forkFromBackup: [DATABASE_TYPES.MONGO_DB],
  forkFromGeneralInformation: [
    DATABASE_TYPES.MYSQL,
    DATABASE_TYPES.POSTGRESQL,
    DATABASE_TYPES.REDIS,
  ],
  replicas: [DATABASE_TYPES.MYSQL, DATABASE_TYPES.POSTGRESQL],
  terminationProtection: [
    DATABASE_TYPES.MYSQL,
    DATABASE_TYPES.POSTGRESQL,
    DATABASE_TYPES.REDIS,
    DATABASE_TYPES.KAFKA,
  ],
  certificate: [
    DATABASE_TYPES.MYSQL,
    DATABASE_TYPES.POSTGRESQL,
    DATABASE_TYPES.KAFKA,
  ],
};

export default function isFeatureActivated(feature, databaseType) {
  return includes(features[feature], databaseType);
}
