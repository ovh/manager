import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@ovh-ux/ng-ovh-sidebar-menu';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import './logs-home.scss';

import account from './account';
import capped from './capped';
import component from './logs-home.component';
import formatsports from './formatsports';
import options from '../options';
import routing from './logs-home.routing';
import service from './logs-home.service';

const moduleName = 'ovhManagerDbaasLogsDetailHome';

angular
  .module(moduleName, [
    'angularMoment',
    'ngOvhCloudUniverseComponents',
    'ngOvhSidebarMenu',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    account,
    capped,
    formatsports,
    options,
  ])
  .config(routing)
  .service('LogsHomeService', service)
  .component('dbaasLogsDetailHome', component);

export default moduleName;
