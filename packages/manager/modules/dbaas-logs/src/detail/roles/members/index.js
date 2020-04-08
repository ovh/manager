import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import add from './add';
import component from './logs-roles-members.component';
import routing from './logs-roles-members.routing';

const moduleName = 'ovhManagerDbaasLogsDetailRolesMembers';

angular
  .module(moduleName, [
    'angularMoment',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    add,
  ])
  .config(routing)
  .component('dbaasLogsDetailRolesMembers', component);

export default moduleName;
