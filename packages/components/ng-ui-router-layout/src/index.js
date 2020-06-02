import angular from 'angular';
import '@uirouter/angularjs';
import 'angular-ui-bootstrap';

import {
  forEach,
  filter,
  get,
  initial,
  intersection,
  isArray,
  isFunction,
  isObject,
  isString,
  kebabCase,
  last,
  map,
  reduce,
  set,
  size,
  startsWith,
  xor,
} from 'lodash-es';

import ouiModalLayoutModule from './oui-modal';
import OuiModalLayout from './oui-modal/layout.class';

const moduleName = 'ngUiRouterLayout';

angular
  .module(moduleName, ['ui.bootstrap', 'ui.router', ouiModalLayoutModule])
  .config(
    /* @ngInject */ ($stateProvider, $transitionsProvider, $injector) => {
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
        if (
          (isString(layout) && layout === 'modal') ||
          (isObject(layout) && get(layout, 'name') === 'modal')
        ) {
          modalLayout = {
            name: 'modal',
            toChilds: state.self.layout.toChilds || false,
            ignoreChilds: state.self.layout.ignoreChilds || [],
            redirectTo: state.self.layout.redirectTo || '^',
            backdrop: state.self.layout.backdrop || true,
            keyboard: state.self.layout.keyboard || false,
          };
        } else if (OuiModalLayout.isLayoutAppliedToState(state)) {
          modalLayout = OuiModalLayout.getLayoutOptions(state);

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
            let componentName = get(
              state,
              'views.modal.component',
              state.component,
            );
            const $state = transition.injector().get('$state');
            const $uibModal = transition.injector().get('$uibModal');

            const componentProvider = get(
              state,
              'views.modal.componentProvider',
              state.componentProvider,
            );

            // If no injection needed returns directly a function
            if (isFunction(componentProvider)) {
              componentName = componentProvider();
            }

            if (isArray(componentProvider)) {
              const resolves = initial(componentProvider);
              const componentGetter = last(componentProvider);
              componentName = componentGetter(
                ...map(resolves, (resolve) =>
                  transition.injector().get(resolve),
                ),
              );
            }

            if (componentName && isString(componentName)) {
              const directives = $injector
                .get(`${componentName}DirectiveProvider`)
                .$get();
              // look for those directives that are components
              const candidateDirectives = directives.filter(
                (directiveInfo) =>
                  directiveInfo.controller &&
                  directiveInfo.controllerAs &&
                  directiveInfo.restrict === 'E',
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
              const elmt = document.createElement(
                kebabCase(directiveInfo.name),
              );
              forEach(resolveKeys, (key) =>
                elmt.setAttribute(kebabCase(key), `$ctrl.${key}`),
              );
              div.appendChild(elmt);
              const template = div.innerHTML;

              modalInstance = $uibModal.open({
                template,
                controller,
                controllerAs: '$ctrl',
                backdrop: get(state, 'layout.backdrop'),
                keyboard: get(state, 'layout.keyboard'),
              });
            } else {
              modalInstance = $uibModal.open({
                templateUrl: get(
                  state,
                  state.views.modal ? 'views.modal.templateUrl' : 'templateUrl',
                ),
                template: get(
                  state,
                  state.views.modal ? 'views.modal.template' : 'template',
                ),
                controller: get(
                  state,
                  state.views.modal ? 'views.modal.controller' : 'controller',
                ),
                controllerAs: get(
                  state,
                  state.views.modal
                    ? 'views.modal.controllerAs'
                    : 'controllerAs',
                  '$ctrl',
                ),
                backdrop: get(state, 'layout.backdrop'),
                keyboard: get(state, 'layout.keyboard'),
              });
            }
            // if backdrop is clicked - be sure to close the modal
            modalInstance.result.catch(() =>
              $state.go(get(state, 'layout.redirectTo')),
            );
          }
        });
      });
    },
  )
  .run(
    /* @ngInject */ ($stateRegistry) => {
      /**
       * As initial URL synchronization is delayed we can check all modal layout states and check
       * if toChilds attribute is setted.
       * For these states we will need to create new states as follow:
       * We will take the direct parent of the modal layout state and create new states with the same
       * layout configuration to all of its child states.
       */
      const layoutStates = filter(
        $stateRegistry.states,
        ({ layout }) =>
          get(layout, 'toChilds') === true || size(get(layout, 'toChilds', [])),
      );

      const getChildStates = (parentStateName) =>
        filter($stateRegistry.states, ({ name }) =>
          startsWith(name, `${parentStateName}.`),
        );
      const getChildStatesNames = (parentStateName) =>
        map(getChildStates(parentStateName), 'name');

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
          set(
            layoutState,
            'layout.ignoreChilds',
            layoutState.layout.ignoreChilds.concat(
              getChildStatesNames(childState),
            ),
          );
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
            layout: {
              // don't know why full config must be defined???
              name: 'modal',
              toChilds: false,
              ignoreChilds: [],
            },
          });
        });
      });
    },
  );

export default moduleName;
