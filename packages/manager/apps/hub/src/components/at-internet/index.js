import angular from 'angular';
import { registerAtInternet } from '@ovh-ux/ng-shell-tracking';
import ovhManagerAtInternetConfiguration from '@ovh-ux/manager-at-internet-configuration';

const moduleName = 'hubAtInternet';

export const initHubAtInternet = (trackingPlugin) => {
  angular
    .module(moduleName, [
      registerAtInternet(trackingPlugin),
      ovhManagerAtInternetConfiguration,
    ])
    .config(
      /* @ngInject */ (atInternetConfigurationProvider) => {
        atInternetConfigurationProvider.setSkipInit(true);
        atInternetConfigurationProvider.setPrefix('hub');
      },
    );

  return moduleName;
};

export default moduleName;
