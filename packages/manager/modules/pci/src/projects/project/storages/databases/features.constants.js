import includes from 'lodash/includes';
import { DATABASE_TYPES } from './databases.constants';

const features = {
  databaseTabs: [DATABASE_TYPES.MYSQL, DATABASE_TYPES.POSTGRE],
  forkFromBackup: [DATABASE_TYPES.MONGO_DB],
};

export default function isFeatureActivated(feature, databaseType) {
  return includes(features[feature], databaseType);
}
