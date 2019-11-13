import component from './dedicatedCloud-datacenter-drp-onPremise.component';
import routing from './dedicatedCloud-datacenter-drp-onPremise.routing';

import onPremisePccStep from './onPremisePcc';
import ovhPccStep from './ovhPcc';

const moduleName = 'dedicatedCloudDatacenterDrpOnPremise';

angular
  .module(moduleName, [
    onPremisePccStep,
    ovhPccStep,
  ])
  .component(component.name, component)
  .config(routing);

export default moduleName;
