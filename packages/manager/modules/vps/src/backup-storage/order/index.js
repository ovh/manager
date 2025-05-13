import routing from './vps-backup-storage-order.routing';

const moduleName = 'ovhManagerVpsBackupStorageOrder';

angular
  .module(moduleName, [])
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
