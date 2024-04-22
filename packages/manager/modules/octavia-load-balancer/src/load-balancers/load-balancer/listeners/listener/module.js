import angular from 'angular';

import routing from './routing';

import l7 from './l7';

const moduleName = 'ovhManagerOctaviaLoadBalancerL7';

angular.module(moduleName, [l7]).config(routing);

export default moduleName;
