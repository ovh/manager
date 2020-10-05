import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';

import add from './add/add.module';
import component from './roles.component';
import editPermissions from './edit-permissions/edit-permissions.module';
import members from './members/members.module';
import overview from './overview/overview.module';
import routing from './roles.routing';
import service from './logs-roles.service';

const moduleName = 'ovhManagerDbaasLogsDetailRoles';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    add,
    editPermissions,
    members,
    overview,
  ])
  .config(routing)
  .service('LogsRolesService', service)
  .component('dbaasLogsDetailRoles', component);

export default moduleName;
