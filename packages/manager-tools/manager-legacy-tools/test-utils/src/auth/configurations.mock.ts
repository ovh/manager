import applications, { applicationURLs } from './applications.mock';
import user from './user.mock';

export const defaultRegion = 'EU';

export const getConfigurationResponse = ({ region = defaultRegion }): any => ({
  region,
  user,
  applicationURLs,
  universe: '',
  message: null,
  applications,
});
