import angular from 'angular';

import DatacenterZertoOvhSecondPccComponent from '../../../../../../components/dedicated-cloud/datacenter/zerto/configuration/ovh/secondPcc';
import routing from './secondPccStep.routing';

const moduleName = 'managedBaremetalDatacenterZertoOvhSecondPccStepModule';

angular
  .module(moduleName, [DatacenterZertoOvhSecondPccComponent])
  .config(routing);

export default moduleName;
