import angular from 'angular';

import service from './service';

const moduleName = 'ngOvhSimpleCountryList';
angular.module(moduleName, []).service('OvhSimpleCountryList', service);

export default moduleName;
