import angular from 'angular';

import provider from './config.provider';

const moduleName = 'coreConfig';

angular.module(moduleName, []).provider('coreConfig', provider);

export default moduleName;
