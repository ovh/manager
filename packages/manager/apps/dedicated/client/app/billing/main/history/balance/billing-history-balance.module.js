import angular from 'angular';
import 'angular-translate';
import '@ovh-ux/ui-kit';
import '@uirouter/angularjs';
import routing from './billing-history-balance.routes';

const moduleName = 'ovhManagerDedicatedBillingHistoryBalance';

angular
  .module(moduleName, [
    'oui',
    'ovh-api-services',
    'pascalprecht.translate',
    'ui.bootstrap',
    'ui.router',
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
