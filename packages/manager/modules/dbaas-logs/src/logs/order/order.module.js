import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './order.component';
import routing from './order.routing';

const moduleName = 'ovhManagerDbaasLogsOrder';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('dbaasLogsOrder', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
