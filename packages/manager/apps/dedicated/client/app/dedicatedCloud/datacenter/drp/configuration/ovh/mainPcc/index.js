import component from '../../common/mainPcc/dedicatedCloud-datacenter-drp-mainPccStep.component';
import routing from './dedicatedCloud-datacenter-drp-ovh-mainPccStep.routing';

const moduleName = 'dedicatedCloudDatacenterDrpOvhMainPccStep';

angular
  .module(moduleName, [])
  .component('dedicatedCloudDatacenterDrpOvhMainPccStep', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
