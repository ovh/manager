import angular from 'angular';

import ovhManagerProductOffers from '@ovh-ux/manager-product-offers';

import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import routing from './upgrade-pack.routing';
import component from './upgrade-pack.component';

const moduleName = 'ovhManagerAnthosDashboardUpgradePack';

angular
  .module(moduleName, [
    'ui.router',
    'oui',
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    ovhManagerProductOffers,
  ])
  .component('anthosDashboardUpgradePack', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
