import routing from './vps-veeam-order.routing';

const moduleName = 'ovhManagerVpsVeeamOrder';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
