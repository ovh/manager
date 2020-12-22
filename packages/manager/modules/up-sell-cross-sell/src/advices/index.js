import angular from 'angular';

import '@ovh-ux/manager-core';
import '@uirouter/angularjs';
import 'angular-translate';

import advices from './component';

const moduleName = 'ovhManagerUpSellCrossSellAdvice';

angular
  .module(moduleName, ['ovhManagerCore', 'pascalprecht.translate', 'ui.router'])
  .component('ovhUpSellCrossSell', advices)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
