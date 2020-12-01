import angular from 'angular';

import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ovh-cloud-universe-components';
import '@uirouter/angularjs';
import 'angular-translate';
import '@ovh-ux/ng-ovh-doc-url';

import './onboarding.less';

import component from './onboarding.component';
import listHeader from '../header/list/list.module';
import routing from './onboarding.routing';

const moduleName = 'ovhManagerDbaasLogsOnboarding';

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
  .component('dbaasLogsOnboarding', component);

export default moduleName;
