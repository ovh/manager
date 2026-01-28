import angular from 'angular';
import angularTranslate from 'angular-translate';
import ngTranslateAsyncLoader from '@ovh-ux/ng-translate-async-loader';
import '@ovh-ux/ui-kit';

import voipConsumptionService from './voip-consumption.service';
import voipConsumptionComponent from './voip-consumption.component';

import routing from './voip-consumption.routing';

const moduleName = 'ovhManagerBillingVoipConsumption';

angular
  .module(moduleName, [
    angularTranslate,
    ngTranslateAsyncLoader,
    'oui',
    'ui.router',
  ])
  .config(routing)
  .component('billingVoipConsumptionComponent', voipConsumptionComponent)
  .service('BillingVoipConsumptionService', voipConsumptionService)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
