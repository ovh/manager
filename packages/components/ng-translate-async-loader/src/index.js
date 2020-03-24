import angular from 'angular';

import factory from './factory';

const moduleName = 'ngTranslateAsyncLoader';

angular.module(moduleName, []).factory('asyncLoader', factory);

export default moduleName;
