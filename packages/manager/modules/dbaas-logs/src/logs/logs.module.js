import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import '@ovh-ux/ui-kit';
import 'angular-chart.js';
import 'angular-ui-bootstrap';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import './logs.scss';

import component from './logs.component';
import constants from './logs-constants';
import logsDetail from './detail/detail.module';
import logsList from './list/list.module';
import logsWelcome from './welcome/welcome.module';
import routing from './logs.routing';

const moduleName = 'ovhManagerDbaasLogsDashboard';

angular
  .module(moduleName, [
    'chart.js',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
    logsDetail,
    logsList,
    logsWelcome,
  ])
  .config(routing)
  .constant('LogsConstants', constants)
  .component('dbaasLogs', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
