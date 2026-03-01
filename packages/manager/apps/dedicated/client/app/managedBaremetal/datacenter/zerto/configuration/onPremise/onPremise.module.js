import angular from 'angular';

import routing from './onPremise.routing';

const moduleName = 'managedBaremetalDatacenterZertoOnPremiseModule';

angular.module(moduleName, []).config(routing);

export default moduleName;
