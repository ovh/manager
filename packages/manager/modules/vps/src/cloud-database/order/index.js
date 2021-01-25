import component from './vps-cloud-database-order.component';
import routing from './vps-cloud-database-order.routing';

const moduleName = 'ovhManagerVpsCloudDatabaseOrder';

angular
  .module(moduleName, [])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
