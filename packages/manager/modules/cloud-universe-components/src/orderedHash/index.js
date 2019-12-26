import angular from 'angular';

import factory from './factory';

const moduleName = 'cucOrderedHash';

angular.module(moduleName, []).factory('CucOrderedHashFactory', factory);

export default moduleName;
