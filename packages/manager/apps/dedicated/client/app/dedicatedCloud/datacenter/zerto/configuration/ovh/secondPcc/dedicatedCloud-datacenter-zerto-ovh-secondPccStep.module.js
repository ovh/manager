import angular from 'angular';

import DatacenterZertoOvhSecondPccComponent from '../../../../../../components/dedicated-cloud/datacenter/zerto/configuration/ovh/secondPcc';
import routing from './dedicatedCloud-datacenter-zerto-ovh-secondPccStep.routing';

const moduleName = 'dedicatedCloudDatacenterZertoOvhSecondPccStepModule';

angular
  .module(moduleName, [DatacenterZertoOvhSecondPccComponent])
  .config(routing);

export default moduleName;
