import { snakeCase } from 'lodash-es';
import iam from './iam.route';

const defaultExport = {
  iam,
};

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
export const ROUTES = (() => {
  const recursiveROUTES = (routes, parentName) =>
    routes.reduce((constants, { name, children = [] }) => {
      const stateName = getStateName(parentName, name);
      return {
        ...constants,
        ...recursiveROUTES(children, stateName),
        [snakeCase(name.split('.').pop()).toUpperCase()]: stateName,
      };
    }, {});

  return recursiveROUTES(Object.values(defaultExport));
})();

/**
 * Declare all the routes onto the given StateProvider instance using its state method
 * @param {StateProvider} $stateProvider
 */
export const declareRoutes = /* @ngInject */ ($stateProvider) => {
  const recursiveDeclareRoutes = (routes, parentName) => {
    routes.forEach(({ name, state, children = [] }) => {
      const stateName = getStateName(parentName, name);
      $stateProvider.state(stateName, state({ $stateProvider, ROUTES }));
      recursiveDeclareRoutes(children, stateName);
    });
  };

  recursiveDeclareRoutes(Object.values(defaultExport));
};

export default defaultExport;
