import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import 'ovh-api-services';
import 'ovh-ui-angular';

import 'ovh-ui-kit/dist/oui.css';
import './alerts-add.scss';

import component from './alerts-add.component';
import routing from './alerts-add.routing';

const moduleName = 'ovhManagerDbaasLogsDetailStreamsAlertsAdd';

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
  .component('dbaasLogsDetailStreamsAlertsAdd', component);

export default moduleName;
