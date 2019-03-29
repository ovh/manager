import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';

import component from './dashboard.component';
import instanceStatusComponent from './instance-status.component';
import routing from './dashboard.routing';

const moduleName = 'ovhManagerPciProjectInstanceDashboard';

angular
  .module(moduleName, [
    'ngOvhOtrs',
    'ui.router',
  ])
  .component('ovhManagerPciProjectInstanceDashboardComponent', component)
  .component('ovhManagerPciProjectInstanceDashboardInstanceStatusComponent', instanceStatusComponent)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
