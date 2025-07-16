import angular from 'angular';

import onPremisePcc from './onPremisePcc';
import ovhPcc from './ovhPcc';
import routing from './onPremise.routing';

const moduleName = 'managedBaremetalDatacenterDrpOnPremiseModule';

angular.module(moduleName, [onPremisePcc, ovhPcc]).config(routing);

export default moduleName;
