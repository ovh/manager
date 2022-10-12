import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import uiRouter from '@uirouter/angularjs';
import ngOvhTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import ovhManagerHub from '@ovh-ux/manager-hub';

import component from './new-pricing.component';
import routing from './routing';

const moduleName = 'ovhManagerHubCatalogPage';

angular
  .module(moduleName, [
    ngOvhTranslateAsyncLoader,
    'oui',
    ovhManagerHub,
    'pascalprecht.translate',
    uiRouter,
  ])
  .component('hubNewPrices', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
