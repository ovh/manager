import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-moment';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import 'bootstrap/less/bootstrap.less';
import './logs.scss';

import component from './logs.component';
import constants from './logs.constants';
import logsDetail from './detail';
import logsList from './list';
import logsWelcome from './welcome';
import momentFilter from './moment.filter';
import routing from './logs.routing';

const moduleName = 'ovhManagerDbaasLogs';

angular
  .module(moduleName, [
    'angularMoment',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    logsDetail,
    logsList,
    logsWelcome,
  ])
  .config(routing)
  .constant('DbaasLogsConstants', constants)
  .filter('momentFormat', momentFilter)
  .component('dbaasLogs', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
