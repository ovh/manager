import component from './vps-cloud-database.component';
import routing from './vps-cloud-database.routing';

import durationFilter from './duration.filter';
import priceFilter from './price.filter';

const moduleName = 'ovhManagerVpsCloudDatabase';

angular
  .module(moduleName, [])
  .component(component.name, component)
  .filter('vpsDuration', durationFilter)
  .filter('vpsPrice', priceFilter)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
