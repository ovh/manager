import angular from 'angular';

import mainPcc from './mainPcc';
import routing from './ovh.routing';
import secondPcc from './secondPcc';

const moduleName = 'managedBaremetalDatacenterDrpOvhModule';

angular.module(moduleName, [mainPcc, secondPcc]).config(routing);

export default moduleName;
