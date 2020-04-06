import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import './logs-aliases-add.scss';

import addController from './logs-aliases-add.controller';
import component from './logs-aliases-add.component';
import routing from './logs-aliases-add.routing';

const moduleName = 'ovhManagerDbaasLogsDetailAliasesAdd';

angular
  .module(moduleName, [
    'angularMoment',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .controller('LogsAliasesAddCtrl', addController)
  .component('dbaasLogsDetailAliasesAdd', component);

export default moduleName;
