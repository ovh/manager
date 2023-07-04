import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import add from './add/add.module';
import component from './osd.component';
import routing from './osd.routing';
import service from './logs-osd.service';

const moduleName = 'ovhManagerDbaasLogsDetailOsd';

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
  .component('dbaasLogsDetailOsd', component)
  .service('LogsOsdService', service)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
