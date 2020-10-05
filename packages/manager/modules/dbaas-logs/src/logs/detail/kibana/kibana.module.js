import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import add from './add/add.module';
import component from './kibana.component';
import routing from './kibana.routing';
import service from './logs-kibana.service';

const moduleName = 'ovhManagerDbaasLogsDetailKibana';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    add,
  ])
  .config(routing)
  .component('dbaasLogsDetailKibana', component)
  .service('LogsKibanaService', service);

export default moduleName;
