import angular from 'angular';

import * as constants from './constants';

/**
 * Assign the constants to the $rootScope
 * @param {RootScope} $rootScope
 */
const assignConstants = /* @ngInject */ ($rootScope) =>
  Object.assign($rootScope, { IAM: { ...$rootScope.IAM, ...constants } });

const moduleName = 'ovhManagerIAMConstants';

angular
  .module(moduleName, [])
  .constant('IAMConstants', constants)
  .run(assignConstants)
  .run(/* @ngTranslationsInject:json ./translations */);

export * from './constants';
export default moduleName;
