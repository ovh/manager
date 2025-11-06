import angular from 'angular';

import DatacenterZertoOnPremiseStepComponent from '../../../../../../components/dedicated-cloud/datacenter/zerto/configuration/onPremise/onPremisePcc';
import routing from './dedicatedCloud-datacenter-zerto-onPremise-onPremisePccStep.routing';

const moduleName =
  'dedicatedCloudDatacenterZertoOnPremiseOnPremisePccStepModule';

angular
  .module(moduleName, [DatacenterZertoOnPremiseStepComponent])
  .config(routing);

export default moduleName;
