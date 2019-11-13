import component from './dedicatedCloud-datacenter-drp-onPremise-onPremisePccStep.component';
import routing from './dedicatedCloud-datacenter-drp-onPremise-onPremisePccStep.routing';

const moduleName = 'dedicatedCloudDatacenterDrpOnPremiseOnPremisePccStep';

angular
  .module(moduleName, [])
  .component(component.name, component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
