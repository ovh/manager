import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import './logs-index.scss';

import add from './add';
import addTool from '../options/addtool';
import component from './logs-index.component';
import routing from './logs-index.routing';
import service from './logs-index.service';
import upgradeQuotaLink from '../options/upgradequotalink';

const moduleName = 'ovhManagerDbaasLogsDetailIndex';

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
    upgradeQuotaLink,
  ])
  .config(routing)
  .service('LogsIndexService', service)
  .component('dbaasLogsDetailIndex', component);

export default moduleName;
