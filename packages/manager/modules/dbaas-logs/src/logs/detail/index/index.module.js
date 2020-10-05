import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import add from './add/add.module';
import component from './index.component';
import routing from './index.routing';
import service from './logs-index.service';

const moduleName = 'ovhManagerDbaasLogsDetailIndex';

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
  .service('LogsIndexService', service)
  .component('dbaasLogsDetailIndex', component);

export default moduleName;
