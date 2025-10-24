import angular from 'angular';

import mainPcc from './mainPcc';
import routing from './dedicatedCloud-datacenter-drp-ovh.routing';
import secondPcc from './secondPcc';

const moduleName = 'dedicatedCloudDatacenterDrpOvhModule';

angular.module(moduleName, [mainPcc, secondPcc]).config(routing);

export default moduleName;
