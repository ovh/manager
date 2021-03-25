import '@ovh-ux/ng-ovh-contracts';
import routing from './vps-windows-order.routing';

const moduleName = 'ovhManagerVpsWindowsOrder';

angular
  .module(moduleName, ['ngOvhContracts'])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
