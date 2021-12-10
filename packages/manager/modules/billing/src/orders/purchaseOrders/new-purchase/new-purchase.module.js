import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './new-purchase.component';
import routing from './new-purchase.routing';

const moduleName = 'ovhManagerBillingOrdersPurchaseNew';
angular
  .module(moduleName, ['ui.router', 'oui', 'ngTranslateAsyncLoader'])
  .component('newPurchase', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
