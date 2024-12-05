import angular from 'angular';

import '@uirouter/angularjs';
import '@ovh-ux/ng-translate-async-loader';
import 'angular-translate';
import '@ovh-ux/ui-kit';

import component from './update-purchase-status.component';
import routing from './update-purchase-status.routing';

const moduleName = 'ovhManagerBillingOrdersPurchaseUpdatePurchaseStatus';
angular
  .module(moduleName, ['ui.router', 'oui', 'ngTranslateAsyncLoader'])
  .component('updatePurchaseStatus', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
