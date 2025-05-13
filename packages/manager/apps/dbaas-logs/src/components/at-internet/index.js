import angular from 'angular';
import ngAtInternet from '@ovh-ux/ng-at-internet';
import ovhManagerAtInternetConfiguration from '@ovh-ux/manager-at-internet-configuration';

import TRACKING from './at-internet.constant';

const moduleName = 'dbaasLogsAtInternet';

angular
  .module(moduleName, [ngAtInternet, ovhManagerAtInternetConfiguration])
  .config(
    /* @ngInject */ (atInternetConfigurationProvider) => {
      atInternetConfigurationProvider.setConfig(TRACKING);
      atInternetConfigurationProvider.setPrefix('dedicated');
    },
  );

export default moduleName;
