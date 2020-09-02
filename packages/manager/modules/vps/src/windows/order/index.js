import routing from './vps-windows-order.routing';

const moduleName = 'ovhManagerVpsWindowsOrder';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
