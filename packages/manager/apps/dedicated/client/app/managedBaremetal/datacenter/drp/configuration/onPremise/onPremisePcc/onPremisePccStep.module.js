import angular from 'angular';

import datacenterDrpOnPremiseStepComponent from '../../../../../../components/dedicated-cloud/datacenter/drp/configuration/onPremise/onPremisePcc';
import routing from './onPremisePccStep.routing';

const moduleName =
  'managedBaremetalDatacenterDrpOnPremiseOnPremisePccStepModule';

angular
  .module(moduleName, [datacenterDrpOnPremiseStepComponent])
  .config(routing);

export default moduleName;
