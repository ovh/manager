import angular from 'angular';

import provider from './provider';

const moduleName = 'ngOvhFeatureFlipping';

angular.module(moduleName, []).provider('ovhFeatureFlipping', provider);

export default moduleName;
