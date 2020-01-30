import forOwn from 'lodash/forOwn';
import get from 'lodash/get';
import isString from 'lodash/isString';

/* eslint-disable no-param-reassign, prefer-rest-params, no-use-before-define */
/**
 *  Decorate functions at runtime for at-internet tracking
 * */
angular
  .module('managerApp')
  .provider(
    'atInternetControllerDecorators',
    function atInternetControllerDecorators($provide) {
      this.decorate = function decorate(config) {
        $provide.decorator('$controller', ($delegate, atInternet) => {
          const getController = function getControllerFn(constructor) {
            const controller = $delegate(...arguments);

            const decorators = getControllerDecorators(constructor);

            if (decorators) {
              const isLazyInstantiation = get(arguments, [2], false);
              if (isLazyInstantiation) {
                return function lazyInstantiationFn() {
                  // force controller constructor execution for to decorate functions
                  return getDecoratedController(controller(), decorators);
                };
              }
              return getDecoratedController(controller, decorators);
            }
            return controller;
          };

          function getDecoratedController(controllerToDecorate, decorators) {
            forOwn(decorators, (behavior, functionToDecorate) => {
              const originFunction = controllerToDecorate[functionToDecorate];

              if (!angular.isFunction(originFunction)) {
                throw new Error(
                  'Specified function to decorate is not a function',
                );
              }

              controllerToDecorate[
                functionToDecorate
              ] = function controllerToDecorateFn() {
                behavior(atInternet, controllerToDecorate, arguments);
                originFunction.apply(controllerToDecorate, arguments);
              };
            });

            return controllerToDecorate;
          }

          function getControllerDecorators(constructor) {
            if (isString(constructor)) {
              return config[constructor.split(' ')[0]];
            }
            return undefined;
          }

          return getController;
        });
      };

      this.$get = function $get() {};
    },
  );
/* eslint-enable no-param-reassign, prefer-rest-params, no-use-before-define */
