import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import './edit-permissions.scss';

import component from './edit-permissions.component';
import dualList from '../../../components/dual-list';
import routing from './edit-permissions.routing';

const moduleName = 'ovhManagerDbaasLogsDetailRolesEditPermissions';

angular
  .module(moduleName, [
    'angularMoment',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    dualList,
  ])
  .config(routing)
  .component('dbaasLogsDetailRolesEditPermissions', component);

export default moduleName;
