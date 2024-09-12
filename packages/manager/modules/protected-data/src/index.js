import angular from 'angular';

import 'angular-translate';

import protectedData from './protectedData.component';

const moduleName = 'ovhManagerProtectedData';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('protectedData', protectedData)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
