import angular from 'angular';
import { registerAtInternet } from '@ovh-ux/ng-shell-tracking';
import ovhManagerAtInternetConfiguration from '@ovh-ux/manager-at-internet-configuration';

import TRACKING from './at-internet.constant';

const moduleName = 'publicCloudAtInternet';

export const initPublicCloudAtInternet = (trackingPlugin) => {
  angular
    .module(moduleName, [
      registerAtInternet(trackingPlugin),
      ovhManagerAtInternetConfiguration,
    ])
    .config(
      /* @ngInject */ (atInternetConfigurationProvider) => {
        atInternetConfigurationProvider.setConfig(TRACKING);
        atInternetConfigurationProvider.setPrefix('PublicCloud');
      },
    );

  return moduleName;
};

export default moduleName;
