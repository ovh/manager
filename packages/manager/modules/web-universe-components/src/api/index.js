import angular from 'angular';

import WucApi from './Api';

const moduleName = 'wucApi';

angular.module(moduleName, []).service('WucApi', WucApi);

export default moduleName;
