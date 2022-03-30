import angular from 'angular';
import { registerAtInternetConfigModule } from '@ovh-ux/manager-at-internet-configuration';

import TRACKING from './at-internet.constant';

const moduleName = 'publicCloudAtInternet';

export const initPublicCloudAtInternet = (trackingPlugin) => {
  angular
    .module(moduleName, [registerAtInternetConfigModule(trackingPlugin)])
    .config(
      /* @ngInject */ (atInternetConfigurationProvider) => {
        atInternetConfigurationProvider.setConfig(TRACKING);
        atInternetConfigurationProvider.setPrefix('PublicCloud');
      },
    );

  return moduleName;
};

export default moduleName;
