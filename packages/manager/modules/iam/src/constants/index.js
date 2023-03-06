import angular from 'angular';

import { ROUTES } from '@iam/routes';
import constants from './constants';

// ---------------------------------------------------------------------------------------------------- //

/**
 * Assign the constants to the $rootScope
 * @param {RootScope} $rootScope
 */
export const assignConstants = /* @ngInject */ ($rootScope) =>
  Object.assign($rootScope, { IAM: { ...constants, ROUTES } });

// ---------------------------------------------------------------------------------------------------- //

const moduleName = 'ovhManagerIAMConstants';

angular
  .module(moduleName, [])
  .run(assignConstants)
  .run(/* @ngTranslationsInject:json ./translations */);

// ---------------------------------------------------------------------------------------------------- //

export * from './constants';
export default moduleName;
