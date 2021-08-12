import angular from 'angular';
import 'angular-translate';
import 'ovh-api-services';
import managerCore from '@ovh-ux/manager-core';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';

import component from './user-dashboard.component';
import routing from './user-dashboard.routing';

import './user-dashboard.less';

const moduleName = 'ovhManagerDedicatedUserAccountDashboard';

angular
  .module(moduleName, [
    managerCore,
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('userAccountDashboard', component);

export default moduleName;
