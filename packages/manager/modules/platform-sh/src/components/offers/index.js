import angular from 'angular';
import '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';
import 'angular-translate';

import ovhManagerCatalogPrice from '@ovh-ux/manager-catalog-price';

import component from './component';
import offerDetails from '../offer-details';

const moduleName = 'ovhManagerPlatformShOffers';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'oui',
    'pascalprecht.translate',
    offerDetails,
    ovhManagerCatalogPrice,
  ])
  .component('platformShOffers', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
