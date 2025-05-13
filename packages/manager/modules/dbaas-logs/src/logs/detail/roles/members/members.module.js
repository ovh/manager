import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import add from './add/add.module';
import component from './members.component';
import routing from './members.routing';

const moduleName = 'ovhManagerDbaasLogsDetailRolesMembers';

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
  .component('dbaasLogsDetailRolesMembers', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
