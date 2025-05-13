import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import addController from './logs-aliases-add.controller';
import component from './add.component';
import routing from './add.routing';

const moduleName = 'ovhManagerDbaasLogsDetailAliasesAdd';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .controller('LogsAliasesAddCtrl', addController)
  .component('dbaasLogsDetailAliasesAdd', component);

export default moduleName;
