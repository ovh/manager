import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-ui-bootstrap';
import '@ovh-ux/ui-kit';

import {
  get,
  initial,
  isArray,
  isFunction,
  isString,
  kebabCase,
  last,
  map,
  merge,
  reduce,
  set,
} from 'lodash-es';

import { LAYOUT_NAME, WINDOW_TEMPLATE_URL } from './constants';

import ouiModalWindowTemplate from './template.html';

const moduleName = 'ngUiRouterLayoutOuiModal';

angular
  .module(moduleName, ['ui.bootstrap', 'ui.router', 'oui'])
  .config(
    /* @ngInject */ ($injector, $transitionsProvider) => {
      // define modalInstance that will be a reference of the opened $uibModal
      let modalInstance;

      // Use onSuccess hook to manage the modal display.
      $transitionsProvider.onSuccess({}, (transition) => {
        transition.promise.finally(() => {
          const state = transition.$to();

          if (get(state, 'layout.name') === LAYOUT_NAME) {
            const $state = transition.injector().get('$state');
            const $uibModal = transition.injector().get('$uibModal');
            const { modalOptions } = state.layout;

            if (
              state.layout.modalOptions.component ||
              state.layout.modalOptions.componentProvider
            ) {
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
                const elmt = document.createElement(
                  kebabCase(directiveInfo.name),
                );

                elmt.setAttribute('data-resolve', '$ctrl.resolve');
                elmt.setAttribute('data-modal-instance', '$ctrl.modalInstance');
                div.appendChild(elmt);
                const template = div.innerHTML;

                Object.assign(modalOptions, {
                  template,
                  controller,
                  controllerAs: '$ctrl',
                });
              }
            } else {
              // set resolve to modal
              const resolves = {};
              transition.getResolveTokens().forEach((token) => {
                set(resolves, token, () => transition.injector().get(token));
              });
              set(modalOptions, 'resolve', resolves);
            }

            modalInstance = $uibModal.open(
              merge(modalOptions, {
                windowTemplateUrl: WINDOW_TEMPLATE_URL,
              }),
            );

            // get the redirectTo when modal is closed
            let redirectTo = '^';
            if (transition.getResolveTokens().includes('redirectTo')) {
              redirectTo = transition.injector().get('redirectTo');
            }

            // manage redirection when modal is closed
            modalInstance.result.catch(() => {
              $state.go(redirectTo);
            });

            // close state modal when exiting the state
            state.onExit = (exitTransition) => {
              modalInstance.close();
              // call state declaration onExit function if present
              let onExitFn = state.self.onExit;
              if (isArray(onExitFn)) {
                onExitFn = last(onExitFn);
              }

              if (isFunction(onExitFn)) {
                onExitFn(exitTransition);
              }
            };
          }
        });
      });
    },
  )
  .run(
    /* @ngInject */ ($templateCache) => {
      // add the oui-modal template in template cache
      $templateCache.put(WINDOW_TEMPLATE_URL, ouiModalWindowTemplate);
    },
  );

export default moduleName;
