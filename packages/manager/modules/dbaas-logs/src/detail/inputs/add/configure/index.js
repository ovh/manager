import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import './logs-inputs-add-configure.scss';
import './logs-inputs-add-configure.less';

import component from './logs-inputs-add-configure.component';
import routing from './logs-inputs-add-configure.routing';

const moduleName = 'ovhManagerDbaasLogsDetailInputsAddConfigure';

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
  .component('dbaasLogsDetailInputsAddConfigure', component);

export default moduleName;
