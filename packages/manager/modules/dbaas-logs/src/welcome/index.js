import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import ngOvhDocUrl from '@ovh-ux/ng-ovh-doc-url';

import './logs-welcome.less';

import component from './logs-welcome.component';
import listHeader from '../header/list';
import routing from './logs-welcome.routing';

const moduleName = 'ovhManagerDbaasLogsWelcome';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    listHeader,
    ngOvhDocUrl,
  ])
  .config(routing)
  .component('dbaasLogsWelcome', component);

export default moduleName;
