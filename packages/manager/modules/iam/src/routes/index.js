import angular from 'angular';

import resolves from '../resolves';

import rootRoute from './root.route';

/**
 * Get the full state name (e.g. with the dots) of a route
 * @param  {...string} parts
 * @returns {string}
 */
const getStateName = (...parts) => parts.filter(Boolean).join('.');

/**
 * Declare all the routes onto the given StateProvider instance using its state method
 * @param {StateProvider} $stateProvider
 */
const declareRoutes = /* @ngInject */ ($stateProvider) => {
  const recursiveDeclareRoutes = (routes, parentName) => {
    routes.forEach(({ route: { name, state }, children = [] }) => {
      const stateName = getStateName(parentName, name);
      $stateProvider.state(stateName, state({ $stateProvider }));
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

export default moduleName;
