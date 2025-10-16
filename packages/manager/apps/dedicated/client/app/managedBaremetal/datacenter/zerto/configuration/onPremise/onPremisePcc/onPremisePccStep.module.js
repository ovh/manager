import angular from 'angular';

import DatacenterZertoOnPremiseStepComponent from '../../../../../../components/dedicated-cloud/datacenter/zerto/configuration/onPremise/onPremisePcc';
import routing from './onPremisePccStep.routing';

const moduleName =
  'managedBaremetalDatacenterZertoOnPremiseOnPremisePccStepModule';

angular
  .module(moduleName, [DatacenterZertoOnPremiseStepComponent])
  .config(routing);

export default moduleName;
