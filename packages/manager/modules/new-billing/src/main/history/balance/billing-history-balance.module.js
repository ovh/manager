import angular from 'angular';
import angularTranslate from 'angular-translate';
import '@ovh-ux/ui-kit';
import uiBootstrap from 'angular-ui-bootstrap';
import uiRouter from '@uirouter/angularjs';
import routing from './billing-history-balance.routes';

const moduleName = 'ovhManagerDedicatedBillingHistoryBalance';

angular
  .module(moduleName, [
    angularTranslate,
    'oui',
    'ovh-api-services',
    uiBootstrap,
    uiRouter,
  ])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
