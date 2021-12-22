import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import uiRouter from '@uirouter/angularjs';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import atInternet from '@ovh-ux/ng-at-internet';
import ngAtInternetUiRouterPlugin from '@ovh-ux/ng-at-internet-ui-router-plugin';

import routing from './cdn-change-offer.routing';
import component from './cdn-change-offer.component';

const moduleName = 'ovhManagerHostingSharedCdnChangeOffer';

angular
  .module(moduleName, [
    uiRouter,
    ngTranslateAsyncLoader,
    atInternet,
    ngAtInternetUiRouterPlugin,
  ])
  .component('cdnChangeOfferComponent', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
