import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-doc-url';

import { Environment } from '@ovh-ux/manager-config';

import logs from './logs';

const moduleName = 'ovhManagerDbaasLogs';

angular.module(moduleName, ['ngOvhDocUrl', 'ovhManagerCore', logs]).config(
  /* @ngInject */ (ovhDocUrlProvider) => {
    ovhDocUrlProvider.setUserLocale(Environment.getUserLocale());
  },
);

export default moduleName;
