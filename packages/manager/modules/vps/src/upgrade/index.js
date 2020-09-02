import routing from './vps-upgrade.routing';

const moduleName = 'ovhManagerVpsUpgrade';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
