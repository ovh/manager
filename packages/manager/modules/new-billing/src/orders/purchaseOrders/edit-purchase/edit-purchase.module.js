import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './edit-purchase.component';
import routing from './edit-purchase.routing';

const moduleName = 'ovhManagerBillingOrdersPurchaseEdit';
angular
  .module(moduleName, ['ui.router', 'oui', 'ngTranslateAsyncLoader'])
  .component('editPurchase', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
