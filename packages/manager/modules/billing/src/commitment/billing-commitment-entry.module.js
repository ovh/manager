import uiRouter from '@uirouter/angularjs';
import routing from './billing-commitment-entry.routing';

const moduleName = 'ovhManagerBillingCommitment';

angular
  .module(moduleName, [uiRouter])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
