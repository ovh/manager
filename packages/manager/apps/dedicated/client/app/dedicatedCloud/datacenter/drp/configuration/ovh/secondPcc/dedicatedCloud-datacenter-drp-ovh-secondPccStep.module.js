import angular from 'angular';

import datacenterDrpOvhSecondPccComponent from '../../../../../../components/dedicated-cloud/datacenter/drp/configuration/ovh/secondPcc';
import routing from './dedicatedCloud-datacenter-drp-ovh-secondPccStep.routing';

const moduleName = 'dedicatedCloudDatacenterDrpOvhSecondPccStepModule';

angular
  .module(moduleName, [datacenterDrpOvhSecondPccComponent])
  .config(routing);

export default moduleName;
