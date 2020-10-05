import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import add from './add/add.module';
import component from './aliases.component';
import home from './home/home.module';
import link from './link/link.module';
import routing from './aliases.routing';
import service from './logs-aliases.service';

const moduleName = 'ovhManagerDbaasLogsDetailAliases';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    add,
    home,
    link,
  ])
  .config(routing)
  .service('LogsAliasesService', service)
  .component('dbaasLogsDetailAliases', component);

export default moduleName;
