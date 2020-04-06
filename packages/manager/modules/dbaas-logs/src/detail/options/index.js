import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import './logs-options.less';

import addTool from './addtool';
import component from './logs-options.component';
import home from './home';
import manage from './manage';
import offer from '../offer';
import routing from './logs-options.routing';
import service from './logs-options.service';
import upgradeQuotaLink from './upgradequotalink';

const moduleName = 'ovhManagerDbaasLogsDetailOptions';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    addTool,
    home,
    manage,
    offer,
    upgradeQuotaLink,
  ])
  .config(routing)
  .service('LogsOptionsService', service)
  .component('dbaasLogsDetailOptions', component);

export default moduleName;
