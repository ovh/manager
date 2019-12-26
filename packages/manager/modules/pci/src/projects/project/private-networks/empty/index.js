import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';

import component from './empty.component';

const moduleName = 'ovhManagerPciPrivateNetworksEmpty';

angular
  .module(moduleName, ['ngTranslateAsyncLoader', 'pascalprecht.translate'])
  .component('pciProjectPrivateNetworksEmpty', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
