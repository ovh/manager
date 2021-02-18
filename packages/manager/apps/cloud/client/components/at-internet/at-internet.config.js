import { TRACKING } from './at-internet.constants';

angular.module('managerApp').config(
  /* @ngInject */ (atInternetConfigurationProvider) => {
    atInternetConfigurationProvider.setPrefix('cloud');
    atInternetConfigurationProvider.setConfig(TRACKING);
  },
);
