import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import './logs-inputs-home.scss';

import addTool from '../../options/addtool';
import component from './logs-inputs-home.component';
import info from './info';
import routing from './logs-inputs-home.routing';
import upgradeQuotaLink from '../../options/upgradequotalink';

const moduleName = 'ovhManagerDbaasLogsDetailInputsHome';

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
    info,
    upgradeQuotaLink,
  ])
  .config(routing)
  .component('dbaasLogsDetailInputsHome', component);

export default moduleName;
