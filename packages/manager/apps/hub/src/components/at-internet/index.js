import angular from 'angular';
import { registerAtInternetConfigModule } from '@ovh-ux/manager-at-internet-configuration';

import TRACKING from './at-internet.constant';

const moduleName = 'hubAtInternet';

export const initHubAtInternet = (trackingPlugin) => {
  angular
    .module(moduleName, [registerAtInternetConfigModule(trackingPlugin)])
    .config(
      /* @ngInject */ (atInternetConfigurationProvider) => {
        console.log('in init');
        atInternetConfigurationProvider.setTrackingPlugin(trackingPlugin);
        atInternetConfigurationProvider.setConfig(TRACKING);
        atInternetConfigurationProvider.setPrefix('hub');
      },
    );

  return moduleName;
};

export default moduleName;
