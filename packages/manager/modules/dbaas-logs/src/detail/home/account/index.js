import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'angular-ui-bootstrap';
import 'ovh-api-services';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import './logs-home-account.scss';

import component from './logs-home-account.component';
import controller from './logs-home-account.controller';
import routing from './logs-home-account.routing';

const moduleName = 'ovhManagerDbaasLogsDetailHomeAccount';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'oui',
    'ovhManagerCore',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .controller('LogsHomeAccountCtrl', controller)
  .component('dbaasLogsDetailHomeAccount', component);

export default moduleName;
