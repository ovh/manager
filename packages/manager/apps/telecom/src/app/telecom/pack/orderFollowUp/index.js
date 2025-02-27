import angular from 'angular';
import component from './orderFollowUp.component';
import routing from './orderFollowUp.routing';

const moduleName = 'ovhManagerTelecomPackOrderFollowUp';

angular
  .module(moduleName, [
    'ngTranslateAsyncLoader',
    'pascalprecht.translate',
    'ovh-api-services',
    'ui.router',
  ])
  .component('orderFollowUp', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
