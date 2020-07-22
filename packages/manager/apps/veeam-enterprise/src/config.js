import { Environment } from '@ovh-ux/manager-config';

export const momentConfiguration = /* @ngInject */ () => {
  const defaultLanguage = Environment.getUserLanguage();
  moment.locale(defaultLanguage);
};

export default {
  momentConfiguration,
};
