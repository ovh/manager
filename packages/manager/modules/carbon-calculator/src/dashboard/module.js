import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/ng-ui-router-breadcrumb';
import '@uirouter/angularjs';
import 'angular-translate';

import carbonCalculatorDashboard from './component';
import carbonBalanceComposition from './carbon-balance-composition/component';
import carbonFootprint from './carbon-footprint/component';
import routing from './routing';
import carbonFootprintService from './carbon-footprint/service';

const moduleName = 'ovhManagerCarbonCalculatorDashboard';

angular
  .module(moduleName, [
    'ngUiRouterBreadcrumb',
    'ovhManagerCore',
    'pascalprecht.translate',
    'ui.router',
  ])
  .config(routing)
  .component('carbonCalculatorDashboard', carbonCalculatorDashboard)
  .component('carbonBalanceComposition', carbonBalanceComposition)
  .component('carbonFootprint', carbonFootprint)
  .service('carbonFootprintService', carbonFootprintService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
