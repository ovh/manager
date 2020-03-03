import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import ovhManagerCore from '@ovh-ux/manager-core';
import 'angular-translate';
import component from './component';

const moduleName = 'ovhManagerHubProductTile';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    ovhManagerCore,
    'pascalprecht.translate',
  ])
  .component('hubProductListing', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
