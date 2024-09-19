import angular from 'angular';

import 'angular-translate';

import iamProtectedData from './iamProtectedData.component.js';

const moduleName = 'ovhManageriamProtectedData';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('iamProtectedData', iamProtectedData)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
