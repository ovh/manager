import angular from 'angular';
import ovhManagerAtInternetConfiguration from '@ovh-ux/manager-at-internet-configuration';
import { registerAtInternet } from '@ovh-ux/ng-shell-tracking';

import TRACKING from './at-internet.constant';

const moduleName = 'publicCloudAtInternet';

export const initAtInternet = (trackingPlugin) => {
  angular
    .module(moduleName, [
      registerAtInternet(trackingPlugin),
      ovhManagerAtInternetConfiguration,
    ])
    .config(async () => {
      await trackingPlugin.setConfig(TRACKING);
    })
    .config(
      /* @ngInject */ (atInternetConfigurationProvider) => {
        atInternetConfigurationProvider.setSkipInit(true);
        atInternetConfigurationProvider.setPrefix('PublicCloud');
      },
    );
  return moduleName;
};

export default moduleName;
