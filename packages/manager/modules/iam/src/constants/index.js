import constants from './constants';

/**
 * Assign the constants to the $rootScope using the given namespace
 * @param {string} namespace
 * @param {any?} otherConstants
 * @returns {function($rootScope)}
 */
export const assignConstants = (namespace, otherConstants) => /* @ngInject */ (
  $rootScope,
) =>
  Object.assign($rootScope, {
    [namespace]: {
      ...otherConstants,
      ...constants,
    },
  });

export * from './constants';
export default constants;
