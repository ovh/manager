import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-ui-angular';
import 'ovh-api-services';

import component from './logs-list.component';
import listHeader from '../header/list';
import logsDetail from '../detail';
import routing from './logs-list.routing';
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
