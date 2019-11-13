import component from '../../common/mainPcc/dedicatedCloud-datacenter-drp-mainPccStep.component';
import routing from './dedicatedCloud-datacenter-drp-onPremise-ovhPccStep.routing';

const moduleName = 'dedicatedCloudDatacenterDrpOnPremiseOvhPccStep';

angular
  .module(moduleName, [])
  .component('dedicatedCloudDatacenterDrpOnPremiseOvhPccStep', component)
  .config(routing)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
