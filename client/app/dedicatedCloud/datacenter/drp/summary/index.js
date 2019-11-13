import component from './dedicatedCloud-datacenter-drp-summary.component';
import routing from './dedicatedCloud-datacenter-drp-summary.routing';

import deleteDrp from './delete';

const moduleName = 'dedicatedCloudDatacenterDrpSummary';

angular
  .module(moduleName, [
    deleteDrp,
  ])
  .config(routing)
  .component(component.name, component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
