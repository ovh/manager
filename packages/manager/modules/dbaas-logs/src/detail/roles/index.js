import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import './logs-roles.scss';
import './logs-roles.less';

import add from './add';
import addTool from '../options/addtool';
import component from './logs-roles.component';
import editPermissions from './edit-permissions';
import members from './members';
import overview from './overview';
import routing from './logs-roles.routing';
import service from './logs-roles.service';
import upgradeQuotaLink from '../options/upgradequotalink';

const moduleName = 'ovhManagerDbaasLogsDetailRoles';

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
    addTool,
    editPermissions,
    members,
    overview,
    upgradeQuotaLink,
  ])
  .config(routing)
  .service('LogsRolesService', service)
  .component('dbaasLogsDetailRoles', component);

export default moduleName;
