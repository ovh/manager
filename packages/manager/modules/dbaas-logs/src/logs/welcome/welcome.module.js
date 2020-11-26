import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-doc-url';

import './logs-welcome.less';

import component from './welcome.component';
import listHeader from '../header/list/list.module';
import routing from './welcome.routing';

const moduleName = 'ovhManagerDbaasLogsWelcome';

angular
  .module(moduleName, [
    'ngOvhCloudUniverseComponents',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
    listHeader,
    'ngOvhDocUrl',
  ])
  .config(routing)
  .component('dbaasLogsWelcome', component);

export default moduleName;
