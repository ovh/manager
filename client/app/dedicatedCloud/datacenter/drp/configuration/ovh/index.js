import component from './dedicatedCloud-datacenter-drp-ovh.component';
import routing from './dedicatedCloud-datacenter-drp-ovh.routing';

import mainPccStep from './mainPcc';
import secondPccStep from './secondPcc';

const moduleName = 'dedicatedCloudDatacenterDrpOvh';

angular
  .module(moduleName, [
    mainPccStep,
    secondPccStep,
  ])
  .component(component.name, component)
  .config(routing);

export default moduleName;
