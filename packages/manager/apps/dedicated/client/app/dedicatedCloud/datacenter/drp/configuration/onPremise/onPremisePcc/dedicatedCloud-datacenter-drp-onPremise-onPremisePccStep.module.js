import angular from 'angular';

import datacenterDrpOnPremiseStepComponent from '../../../../../../components/dedicated-cloud/datacenter/drp/configuration/onPremise/onPremisePcc';
import routing from './dedicatedCloud-datacenter-drp-onPremise-onPremisePccStep.routing';

const moduleName = 'dedicatedCloudDatacenterDrpOnPremiseOnPremisePccStepModule';

angular
  .module(moduleName, [datacenterDrpOnPremiseStepComponent])
  .config(routing);

export default moduleName;
