import angular from 'angular';
import ovhManagerAtInternetConfiguration from '@ovh-ux/manager-at-internet-configuration';

import TRACKING from './at-internet.constant';

const moduleName = 'dbaasLogsAtInternet';

angular.module(moduleName, [ovhManagerAtInternetConfiguration]).config(
  /* @ngInject */ (atInternetConfigurationProvider) => {
    atInternetConfigurationProvider.setConfig(TRACKING);
    atInternetConfigurationProvider.setPrefix('dedicated');
  },
);

export default moduleName;
