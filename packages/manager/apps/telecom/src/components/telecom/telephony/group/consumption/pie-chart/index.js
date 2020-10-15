import angular from 'angular';
import ngOvhTelecomUniverseComponents from '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import 'ovh-api-services';

import directive from './pie-chart.directive';

import './pie-chart.less';

const moduleName =
  'ovhManagerTelecomComponentsTelecomTelephonyGroupConsumptionPieChart';

angular
  .module(moduleName, [
    ngOvhTelecomUniverseComponents,
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .directive('groupConsumptionPieChart', directive)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
