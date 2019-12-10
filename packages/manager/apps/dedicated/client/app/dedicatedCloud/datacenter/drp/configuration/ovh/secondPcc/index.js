import component from './dedicatedCloud-datacenter-drp-ovh-secondPccStep.component';
import routing from './dedicatedCloud-datacenter-drp-ovh-secondPccStep.routing';

const moduleName = 'dedicatedCloudDatacenterDrpOvhSecondPccStep';

angular
  .module(moduleName, [])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
