import angular from 'angular';

import provider from './provider';

const moduleName = 'cucConfig';

angular.module(moduleName, []).provider('CucConfig', provider);

export default moduleName;
