import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import 'ovh-api-services';

import component from './list.component';
import listHeader from '../header/list/list.module';
import logsDetail from '../detail/detail.module';
import routing from './list.routing';
import service from './logs-list.service';

const moduleName = 'ovhManagerDbaasLogsList';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    listHeader,
    logsDetail,
  ])
  .config(routing)
  .service('LogsListService', service)
  .component('dbaasLogsList', component);

export default moduleName;
