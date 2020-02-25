import angular from 'angular';
import 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ovhManagerCore from '@ovh-ux/manager-core';

import component from './catalog-price.component';

const moduleName = 'ovhManagerCatalogPrice';

angular
  .module(moduleName, [
    ngTranslateAsyncLoader,
    'oui',
    ovhManagerCore,
    'pascalprecht.translate',
  ])
  .component('ovhManagerCatalogPrice', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
