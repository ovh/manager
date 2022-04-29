import angular from 'angular';

import 'angular-translate';

import component from './edit-name.component';

const moduleName = 'ovhManagerNashaComponentsEditName';

angular
  .module(moduleName, ['pascalprecht.translate'])
  .component('nashaComponentsEditName', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
