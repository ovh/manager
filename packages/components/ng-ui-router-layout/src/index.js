import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-ui-bootstrap';

import forEach from 'lodash/forEach';
import filter from 'lodash/filter';
import get from 'lodash/get';
import initial from 'lodash/initial';
import intersection from 'lodash/intersection';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import isObject from 'lodash/isObject';
import isString from 'lodash/isString';
import kebabCase from 'lodash/kebabCase';
import last from 'lodash/last';
import map from 'lodash/map';
import reduce from 'lodash/reduce';
import set from 'lodash/set';
import size from 'lodash/size';
import startsWith from 'lodash/startsWith';
import xor from 'lodash/xor';

const moduleName = 'ngUiRouterLayout';

angular
  .module(moduleName, [
    'ui.bootstrap',
    'ui.router',
  ])
  .config(/* @ngInject */($stateProvider, $transitionsProvider, $injector) => {
    let modalInstance = null;

    /**
     *  Create a decorator for our new state attribute 'layout'.
     *  For modal layout, the attribute can be a string or an object:
     *  - if string - value must be 'modal'
     *  - if object - avaiable attributes are:
     *    - name: the value must be 'modal'.
     *    - toChilds (default value: 'false'):
     *      - can be a boolean: 'true' to declare the modal state to all direct parent childs.
     *      - or an array of string that contains the childs of the direct parents where the modal
     *        needs to be displayed.
     *    - ignoreChilds: an array of string that contains states names where the modal state
     *                    doesn't need to be displayed.
     */
    $stateProvider.decorator('layout', (state) => {
      let modalLayout;
      const layout = get(state, 'self.layout');
      if ((isString(layout) && layout === 'modal')
        || (isObject(layout) && get(layout, 'name') === 'modal')) {
        modalLayout = {
          name: 'modal',
          toChilds: state.self.layout.toChilds || false,
          ignoreChilds: state.self.layout.ignoreChilds || [],
          redirectTo: state.self.layout.redirectTo || '^',
        };
      }

      if ((isString(layout) && layout === 'modalTest')
        || (isObject(layout) && get(layout, 'name') === 'modalTest')) {
        // set modal options
        modalLayout = {
          name: 'modalTest',
          modalOptions: {
            template: get(state, 'template'),
            templateUrl: get(state, 'templateUrl'),
            controller: get(state, 'controller'),
            controllerAs: get(state, 'controllerAs'),
            component: get(state, 'component'),
            componentProvider: get(state, 'componentProvider'),
          },
        };

        // reset state views to avoid state default view to display its content
        set(state, 'views', {});
      }

      return modalLayout;
    });

    /**
     * Use onSuccess hook to manage the modal display.
     */
    $transitionsProvider.onSuccess({}, (transition) => {
      transition.promise.finally(() => {
        const state = transition.$to();

        // close previous modal
        if (modalInstance) {
          modalInstance.close();
        }

        if (get(state, 'layout.name') === 'modal') {
          let componentName = get(state, 'views.modal.component', state.component);
          const $state = transition.injector().get('$state');
          const $uibModal = transition.injector().get('$uibModal');

          const componentProvider = get(state, 'views.modal.componentProvider', state.componentProvider);

          // If no injection needed returns directly a function
          if (isFunction(componentProvider)) {
            componentName = componentProvider();
          }

          if (isArray(componentProvider)) {
            const resolves = initial(componentProvider);
            const componentGetter = last(componentProvider);
            componentName = componentGetter(
              ...map(resolves, resolve => transition.injector().get(resolve)),
            );
          }

          if (componentName && isString(componentName)) {
            const directives = $injector.get(`${componentName}DirectiveProvider`).$get();
            // look for those directives that are components
            const candidateDirectives = directives.filter(
              directiveInfo => directiveInfo.controller
                && directiveInfo.controllerAs
                && directiveInfo.restrict === 'E',
            );

            if (candidateDirectives.length === 0) {
              throw new Error('No component found');
            }
            if (candidateDirectives.length > 1) {
              throw new Error('Too many components found');
            }
            // get the info of the component
            const [directiveInfo] = candidateDirectives;

            // create controller
            const resolves = reduce(
              transition.getResolveTokens(),
              (acc, resolveKey) => ({
                ...acc,
                [resolveKey]: transition.injector().get(resolveKey),
              }),
              {},
            );
            const controller = () => resolves;

            // get resolveKeys compatibles with component bindings
            const resolveKeys = intersection(
              transition.getResolveTokens(),
              Object.keys(directiveInfo.bindToController),
            );

            // create template
            const div = document.createElement('div');
            const elmt = document.createElement(kebabCase(directiveInfo.name));
            forEach(resolveKeys, key => elmt.setAttribute(kebabCase(key), `$ctrl.${key}`));
            div.appendChild(elmt);
            const template = div.innerHTML;

            modalInstance = $uibModal.open({
              template,
              controller,
              controllerAs: '$ctrl',
            });
          } else {
            modalInstance = $uibModal.open({
              templateUrl: get(state, state.views.modal ? 'views.modal.templateUrl' : 'templateUrl'),
              template: get(state, state.views.modal ? 'views.modal.template' : 'template'),
              controller: get(state, state.views.modal ? 'views.modal.controller' : 'controller'),
              controllerAs: get(state, state.views.modal ? 'views.modal.controllerAs' : 'controllerAs', '$ctrl'),
            });
          }
          // if backdrop is clicked - be sure to close the modal
          modalInstance.result.catch(() => $state.go(get(state, 'layout.redirectTo')));
        }
      });
    });
  })
  .run(/* @ngInject */($injector, $state, $stateRegistry, $uibModal) => {
    filter(
      $stateRegistry.states,
      ({ layout }) => get(layout, 'name') === 'modalTest',
    ).forEach((layoutState) => {
      const state = layoutState;

      state.onEnter = (transition) => {
        let { modalOptions } = state.layout;
        // define modalInstance that will be a reference of the opnened $uibModal
        let modalInstance;

        if (state.layout.modalOptions.component || state.layout.modalOptions.componentProvider) {
          // if there is a component or componentProvider in modal options
          // define the modal options with controller and template instanciated.
          // Let's also make bindings and resolve compatible with
          // version >= 2.1.0 of angular-ui-bootstrap
          // see https://angular-ui.github.io/bootstrap/versioned-docs/2.1.0/#/modal

          let componentName = state.layout.modalOptions.component;
          const { componentProvider } = state.layout.modalOptions;

          // if no injection needed returns directly a function
          if (isFunction(componentProvider)) {
            componentName = componentProvider();
          } else if (isArray(componentProvider)) {
            const resolves = initial(componentProvider);
            const componentGetter = last(componentProvider);
            componentName = componentGetter(
              ...map(resolves, resolve => transition.injector().get(resolve)),
            );
          }

          if (componentName && isString(componentName)) {
            const directives = $injector.get(`${componentName}Directive`);
            // look for those directives that are components
            const candidateDirectives = directives.filter(
              directiveInfo => directiveInfo.controller
                && directiveInfo.controllerAs
                && directiveInfo.restrict === 'E',
            );

            if (candidateDirectives.length === 0) {
              throw new Error('No component found');
            }
            if (candidateDirectives.length > 1) {
              throw new Error('Too many components found');
            }
            // get the info of the component
            const [directiveInfo] = candidateDirectives;

            // create controller
            const controller = () => ({
              resolve: reduce(
                transition.getResolveTokens(),
                (acc, resolveKey) => ({
                  ...acc,
                  [resolveKey]: transition.injector().get(resolveKey),
                }),
                {},
              ),
              modalInstance,
            });

            // create template
            const div = document.createElement('div');
            const elmt = document.createElement(kebabCase(directiveInfo.name));
            elmt.setAttribute('data-resolve', '$ctrl.resolve');
            elmt.setAttribute('data-modal-instance', '$ctrl.modalInstance');
            div.appendChild(elmt);
            const template = div.innerHTML;

            modalOptions = {
              template,
              controller,
              controllerAs: '$ctrl',
            };
          }
        } else {
          // set resolve to modal
          const resolves = {};
          transition.getResolveTokens().forEach((token) => {
            set(resolves, token, () => transition.injector().get(token));
          });
          set(modalOptions, 'resolve', resolves);
        }

        // open the modal
        modalInstance = $uibModal.open(modalOptions);
        // get the redirectTo when modal is closed
        let redirectTo = '^';
        if (transition.getResolveTokens().includes('redirectTo')) {
          redirectTo = transition.injector().get('redirectTo');
        }

        // define some params that will be send with redirectTo
        let redirectToParams = null;

        // manage redirection when modal is closed
        modalInstance.result
          .then((data) => {
            redirectToParams = {
              status: 'success',
              data,
            };
          })
          .catch((reason) => {
            if (isObject(reason)) {
              redirectToParams = {
                status: 'error',
                data: reason,
              };
            }
          })
          .finally(() => {
            if (redirectToParams) {
              $state.go(redirectTo, { redirectToParams });
            } else {
              $state.go(redirectTo);
            }
          });
      };
    });
  })
  .run(/* @ngInject */($stateRegistry) => {
    /**
     * As initial URL synchronization is delayed we can check all modal layout states and check
     * if toChilds attribute is setted.
     * For these states we will need to create new states as follow:
     * We will take the direct parent of the modal layout state and create new states with the same
     * layout configuration to all of its child states.
     */
    const layoutStates = filter(
      $stateRegistry.states,
      ({ layout }) => get(layout, 'toChilds') === true || size(get(layout, 'toChilds', [])),
    );

    const getChildStates = parentStateName => filter(
      $stateRegistry.states,
      ({ name }) => startsWith(name, `${parentStateName}.`),
    );
    const getChildStatesNames = parentStateName => map(getChildStates(parentStateName), 'name');

    layoutStates.forEach((layoutState) => {
      let childStates;

      // build child states that need modal layout applied
      if (angular.isArray(layoutState.layout.toChilds)) {
        childStates = layoutState.layout.toChilds;
      } else {
        childStates = getChildStatesNames(layoutState.parent.name);
      }

      // build child states that need to be ignored
      // 1st: all child states of each states that need to be ignored
      // 2nd: current layout state doesn't need to have itself as modal child
      layoutState.layout.ignoreChilds.forEach((childState) => {
        set(layoutState, 'layout.ignoreChilds', layoutState.layout.ignoreChilds.concat(getChildStatesNames(childState)));
      });
      layoutState.layout.ignoreChilds.push(layoutState.name);

      // remove child states that need to be ignored
      childStates = xor(childStates, layoutState.layout.ignoreChilds);

      // create child state with layout settings applied
      const modalSateSuffix = last(layoutState.name.split('.'));
      childStates.forEach((childState) => {
        $stateRegistry.register({
          name: `${childState}.${modalSateSuffix}`,
          url: layoutState.self.url,
          templateUrl: layoutState.self.templateUrl,
          controller: layoutState.self.controller,
          component: layoutState.self.component,
          layout: { // don't know why full config must be defined???
            name: 'modal',
            toChilds: false,
            ignoreChilds: [],
          },
        });
      });
    });
  });

export default moduleName;
