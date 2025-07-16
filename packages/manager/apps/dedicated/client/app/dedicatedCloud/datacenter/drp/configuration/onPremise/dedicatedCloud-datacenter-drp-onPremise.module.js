import angular from 'angular';

import onPremisePcc from './onPremisePcc';
import ovhPcc from './ovhPcc';
import routing from './dedicatedCloud-datacenter-drp-onPremise.routing';

const moduleName = 'dedicatedCloudDatacenterDrpOnPremiseModule';

angular.module(moduleName, [onPremisePcc, ovhPcc]).config(routing);

export default moduleName;
