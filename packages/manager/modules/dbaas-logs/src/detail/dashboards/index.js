import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import './logs-dashboards.scss';

import addTool from '../options/addtool';
import component from './logs-dashboards.component';
import crud from './crud';
import routing from './logs-dashboards.routing';
import service from './logs-dashboards.service';
import upgradeQuotaLink from '../options/upgradequotalink';

const moduleName = 'ovhManagerDbaasLogsDetailDashboards';

angular
  .module(moduleName, [
    'angularMoment',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    addTool,
    crud,
    upgradeQuotaLink,
  ])
  .config(routing)
  .service('LogsDashboardsService', service)
  .component('dbaasLogsDetailDashboards', component);

export default moduleName;
