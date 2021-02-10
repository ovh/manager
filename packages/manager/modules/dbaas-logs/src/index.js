import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-at-internet';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-doc-url';

import { Environment } from '@ovh-ux/manager-config';

import logs from './logs';
import cuiDualList from './components/dual-list';

const moduleName = 'ovhManagerDbaasLogs';

angular
  .module(moduleName, [
    cuiDualList,
    'ngOvhDocUrl',
    'ovhManagerCore',
    'ngAtInternet',
    'pascalprecht.translate',
    'ui.router',
    logs,
  ])
  .config(
    /* @ngInject */ (ovhDocUrlProvider) => {
      ovhDocUrlProvider.setUserLocale(Environment.getUserLocale());
    },
  );

export default moduleName;
