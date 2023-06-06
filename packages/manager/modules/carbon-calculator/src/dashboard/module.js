import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@uirouter/angularjs';
import 'angular-translate';

import component from './component';
import routing from './routing';

const moduleName = 'ovhManagerCarbonCalculatorDashboard';

angular
  .module(moduleName, [
    'ngUiRouterBreadcrumb',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('carbonCalculatorDashboard', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
