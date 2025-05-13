import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-doc-url';

import logs from './logs';

const moduleName = 'ovhManagerDbaasLogs';

angular.module(moduleName, ['ngOvhDocUrl', 'ovhManagerCore', logs]).config(
  /* @ngInject */ (ovhDocUrlProvider, coreConfigProvider) => {
    ovhDocUrlProvider.setUserLocale(coreConfigProvider.getUserLocale());
  },
);

export default moduleName;
