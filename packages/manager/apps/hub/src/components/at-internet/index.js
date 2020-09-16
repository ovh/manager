import angular from 'angular';
import ovhManagerAtInternetConfiguration from '@ovh-ux/manager-at-internet-configuration';

import TRACKING from './at-internet.constant';

const moduleName = 'hubAtInternet';

angular.module(moduleName, [ovhManagerAtInternetConfiguration]).config(
  /* @ngInject */ (atInternetConfigurationProvider) => {
    atInternetConfigurationProvider.setConfig(TRACKING);
    atInternetConfigurationProvider.setPrefix('hub');
  },
);

export default moduleName;
