import component from './vps-cloud-database.component';
import routing from './vps-cloud-database.routing';

import durationFilter from './duration.filter';
import priceFilter from './price.filter';
import ovhManagerVpsCloudDatabaseOrder from './order';

const moduleName = 'ovhManagerVpsCloudDatabase';

angular
  .module(moduleName, [ovhManagerVpsCloudDatabaseOrder])
  .component(component.name, component)
  .filter('vpsDuration', durationFilter)
  .filter('vpsPrice', priceFilter)
  .config(routing);

export default moduleName;
