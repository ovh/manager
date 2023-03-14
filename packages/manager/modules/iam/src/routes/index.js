import angular from 'angular';
import { snakeCase } from 'lodash-es';

import resolves from '@iam/resolves';

import rootRoute from './root.route';

/**
 * Get the full state name (e.g. with the dots) of a route
 * @param  {...string} parts
 * @returns {string}
 */
const getStateName = (...parts) => parts.filter(Boolean).join('.');

/**
 * Set where all the keys represent the last state name part (e.g. after the last dot) of the route
 * in upper case and all the values are the full state name (e.g. with the dots) of the route
 *
 * for instance:
 *
 * ROUTES = {
 *   IAM: 'iam',
 *   POLICY: 'iam.policy',
 *   POLICIES: 'iam.policy.policies,
 *   ...
 * }
 *
 * @type {Object<string, string>}
 */
const ROUTES = (() => {
  const recursiveROUTES = (routes, parentName) =>
    routes.reduce((constants, { route: { name }, children = [] }) => {
      const stateName = getStateName(parentName, name);
      return {
        ...constants,
        ...recursiveROUTES(children, stateName),
        [snakeCase(name.split('.').pop()).toUpperCase()]: stateName,
      };
    }, {});
  return recursiveROUTES(rootRoute);
})();

/**
 * Declare all the routes onto the given StateProvider instance using its state method
 * @param {StateProvider} $stateProvider
 */
const declareRoutes = /* @ngInject */ ($stateProvider) => {
  const recursiveDeclareRoutes = (routes, parentName) => {
    routes.forEach(({ route: { name, state }, children = [] }) => {
      const stateName = getStateName(parentName, name);
      $stateProvider.state(stateName, state({ $stateProvider, ROUTES }));
      recursiveDeclareRoutes(children, stateName);
    });
  };
  recursiveDeclareRoutes(rootRoute);
};

const moduleName = 'ovhManagerIAMRoutes';

angular
  .module(moduleName, [resolves])
  .config(declareRoutes)
  .run(/* @ngTranslationsInject:json ./translations */);

export { ROUTES };
export default moduleName;
