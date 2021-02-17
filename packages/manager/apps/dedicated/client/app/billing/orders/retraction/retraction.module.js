import routing from './retraction.routing';

const moduleName = 'ovhManagerBillingOrdersRetraction';

angular
  .module(moduleName, ['ui.router'])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
