import routing from './vps-snapshot-order.routing';

const moduleName = 'ovhManagerVpsSnapshotOrder';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
