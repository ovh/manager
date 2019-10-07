import angular from 'angular';

import '@uirouter/angularjs';
import 'angular-ui-bootstrap';
import 'ovh-ui-angular';

import filter from 'lodash/filter';
import get from 'lodash/get';
import initial from 'lodash/initial';
import isArray from 'lodash/isArray';
import isFunction from 'lodash/isFunction';
import isString from 'lodash/isString';
import kebabCase from 'lodash/kebabCase';
import last from 'lodash/last';
import map from 'lodash/map';
import merge from 'lodash/merge';
import reduce from 'lodash/reduce';
import set from 'lodash/set';

import {
  LAYOUT_NAME,
  WINDOW_TEMPLATE_URL,
} from './constants';

import ouiModalWindowTemplate from './template.html';

const moduleName = 'ngUiRouterLayoutOuiModal';

angular
  .module(moduleName, [
    'ui.bootstrap',
    'ui.router',
    'oui',
  ])
  .run(/* @ngInject */ ($templateCache) => {
    // add the oui-modal template in template cache
    $templateCache.put(WINDOW_TEMPLATE_URL, ouiModalWindowTemplate);
  })
  .run(/* @ngInject */ ($injector, $state, $stateRegistry, $uibModal) => {
    // filter declared states to detect which are ouiModal layout states
    const ouiModalStates = filter(
      $stateRegistry.states,
      ({ layout }) => get(layout, 'name') === LAYOUT_NAME,
    );

    // for each ouiModal layout states declare how they open
    ouiModalStates.forEach((ouiModalState) => {
      const state = ouiModalState;

      // define modalInstance that will be a reference of the opened $uibModal
      let modalInstance;

      // open the modal instance at state onEnter
      state.onEnter = (transition) => {
        let { modalOptions } = state.layout;

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

            // let pre = document.createElement('pre');
            // pre.innerHTML = '{{ $parent.$ctrl | json }}';
            // div.appendChild(pre);
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

        modalInstance = $uibModal.open(merge(modalOptions, {
          windowTemplateUrl: WINDOW_TEMPLATE_URL,
        }));

        // get the redirectTo when modal is closed
        let redirectTo = '^';
        if (transition.getResolveTokens().includes('redirectTo')) {
          redirectTo = transition.injector().get('redirectTo');
        }

        // manage redirection when modal is closed
        modalInstance.result.catch(() => {
          $state.go(redirectTo);
        });
      };

      // close state modal when exiting the state
      state.onExit = () => {
        modalInstance.close();
      };
    });
  });


export default moduleName;
