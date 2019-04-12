import angular from 'angular';

import 'angular-translate';
import '@ovh-ux/ng-translate-async-loader';
import 'ovh-ui-angular';

import component from './header.component';

const moduleName = 'ovhManagerPciPrivateNetworksHeader';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'oui',
  ])
  .component('pciProjectPrivateNetworksHeader', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
