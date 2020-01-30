import routing from './vps-order-additional-disk-order.routing';

import additionalDiskOptionsFilter from './legacy/additional-disk-option.filter';

const moduleName = 'ovhManagerVpsAdditionnalDiskOrder';

angular
  .module(moduleName, [])
  .config(routing)
  .filter('vpsAdditionalDiskOptions', additionalDiskOptionsFilter);

export default moduleName;
