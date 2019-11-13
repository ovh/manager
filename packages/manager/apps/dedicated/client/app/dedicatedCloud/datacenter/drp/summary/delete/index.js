import component from './dedicatedCloud-datacenter-drp-summary-delete.component';
import routing from './dedicatedCloud-datacenter-drp-summary-delete.routing';

const moduleName = 'dedicatedCloudDatacenterDrpSummaryDeleteModule';

angular
  .module(moduleName, [])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
