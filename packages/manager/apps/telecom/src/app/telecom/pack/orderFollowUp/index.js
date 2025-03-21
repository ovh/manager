import angular from 'angular';
import component from './orderFollowUp.component';
import routing from './orderFollowUp.routing';
import service from './orderFollowUp.service';

const moduleName = 'ovhManagerTelecomPackOrderFollowUp';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .component('orderFollowUp', component)
  .service('OrderFollowUpService', service)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
