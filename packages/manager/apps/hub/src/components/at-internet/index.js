import angular from 'angular';
import { registerAtInternet } from '@ovh-ux/ng-shell-tracking';
import ovhManagerAtInternetConfiguration from '@ovh-ux/manager-at-internet-configuration';

import TRACKING from './at-internet.constant';

const moduleName = 'hubAtInternet';

export const initHubAtInternet = (trackingPlugin) => {
  angular
    .module(moduleName, [
      registerAtInternet(trackingPlugin),
      ovhManagerAtInternetConfiguration,
    ])
    .config(
      /* @ngInject */ (atInternetConfigurationProvider) => {
        atInternetConfigurationProvider.setTrackingPlugin(trackingPlugin);
        atInternetConfigurationProvider.setConfig(TRACKING);
        atInternetConfigurationProvider.setPrefix('hub');
      },
    );

  return moduleName;
};

export default moduleName;
