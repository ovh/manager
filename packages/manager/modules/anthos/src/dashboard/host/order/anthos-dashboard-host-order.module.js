import angular from 'angular';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './anthos-dashboard-host-order.component';
import routing from './anthos-dashboard-host-order.routing';

const moduleName = 'ovhManagerAnthosDashboardHostOrder';

angular
  .module(moduleName, ['oui', 'pascalprecht.translate', 'ui.router'])
  .component('anthosDashboardHostOrder', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
