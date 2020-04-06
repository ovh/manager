import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import './logs-options-manage.scss';

import aliases from '../../aliases';
import component from './logs-options-manage.component';
import overview from './overview';
import routing from './logs-options-manage.routing';
import service from './logs-options-manage.service';

const moduleName = 'ovhManagerDbaasLogsDetailOptionsManage';

angular
  .module(moduleName, [
    'angularMoment',
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
    aliases,
    overview,
  ])
  .config(routing)
  .service('LogsOptionsManageService', service)
  .component('dbaasLogsDetailOptionsManage', component);

export default moduleName;
