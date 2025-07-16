import angular from 'angular';

import routing from './onPremisePccStep.routing';

const moduleName =
  'managedBaremetalDatacenterDrpOnPremiseOnPremisePccStepModule';

angular.module(moduleName, []).config(routing);

export default moduleName;
