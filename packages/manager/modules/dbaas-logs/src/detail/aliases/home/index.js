import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import './logs-aliases-home.scss';

import addTool from '../../options/addtool';
import component from './logs-aliases-home.component';
import routing from './logs-aliases-home.routing';
import upgradeQuotaLink from '../../options/upgradequotalink';

const moduleName = 'ovhManagerDbaasLogsDetailAliasesHome';

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
    upgradeQuotaLink,
  ])
  .config(routing)
  .component('dbaasLogsDetailAliasesHome', component);

export default moduleName;
