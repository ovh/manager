import filter from 'lodash/filter';
import get from 'lodash/get';
import last from 'lodash/last';
import map from 'lodash/map';
import set from 'lodash/set';
import size from 'lodash/size';
import startsWith from 'lodash/startsWith';
import xor from 'lodash/xor';

angular
  .module('managerApp')
  .config(($stateProvider, $transitionsProvider, $urlServiceProvider) => {
    let modalInstance = null;

    /**
     * Delay initial URL synchronization.
     * As we will create some states later (at run phase), maybe the url we want to access
     * is not yet configured. So wait a moment that all states are declared (at config phase)
     * and re-launch the URL sync later.
     */
    $urlServiceProvider.deferIntercept();

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

      if (get(state, 'self.layout') === 'modal' || get(state, 'self.layout.name') === 'modal') {
        modalLayout = {
          name: 'modal',
          toChilds: state.self.layout.toChilds || false,
          ignoreChilds: state.self.layout.ignoreChilds || [],
          redirectTo: state.self.layout.redirectTo || '^',
        };
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
          const $state = transition.injector().get('$state');
          const $uibModal = transition.injector().get('$uibModal');

          modalInstance = $uibModal.open({
            templateUrl: get(state, state.views.modal ? 'views.modal.templateUrl' : 'templateUrl'),
            controller: get(state, state.views.modal ? 'views.modal.controller' : 'controller'),
            controllerAs: get(state, state.views.modal ? 'views.modal.controllerAs' : 'controllerAs', '$ctrl'),
          });

          // if backdrop is clicked - be sure to close the modal
          modalInstance.result.catch(() => $state.go(get(state, 'layout.redirectTo')));
        }
      });
    });
  })
  .run(($transitions, $state, $stateRegistry, $urlService) => {
    // manage restriction on billing section for enterprise account
    // see src/billing/billingApp.js for resolve restriction on billing states
    $transitions.onError({}, (transition) => {
      const error = transition.error();
      if (get(error, 'status') === 403 && get(error, 'code') === 'FORBIDDEN_BILLING_ACCESS') {
        $state.go('app.error', { error });
      }
    });

    /**
     * As initial URL synchronization is delayed we can check all modal layout states and check
     * if toChilds attribute is setted.
     * For these states we will need to create new states as follow:
     * We will take the direct parent of the modal layout state and create new states with the same
     * layout configuration to all of its child states.
     */
    const layoutStates = filter($stateRegistry.states, ({ layout }) => get(layout, 'toChilds') === true || size(get(layout, 'toChilds', [])));
    const getChildStates = parentStateName => filter($stateRegistry.states, ({ name }) => startsWith(name, `${parentStateName}.`));

    layoutStates.forEach((layoutState) => {
      let childStates;

      // build child states that need modal layout applied
      if (angular.isArray(layoutState.layout.toChilds)) {
        childStates = layoutState.layout.toChilds;
      } else {
        childStates = map(getChildStates(layoutState.parent.name), 'name');
      }

      // build child states that need to be ignored
      // 1st: all child states of each states that need to be ignored
      // 2nd: current layout state doesn't need to have itself as modal child
      layoutState.layout.ignoreChilds.forEach((childState) => {
        set(layoutState, 'layout.ignoreChilds', layoutState.layout.ignoreChilds.concat(map(getChildStates(childState), 'name')));
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
          layout: { // don't know why full config must be defined???
            name: 'modal',
            toChilds: false,
            ignoreChilds: [],
          },
        });
      });
    });

    $urlService.listen(); // Start responding to URL changes
    $urlService.sync(); // Find the matching URL and invoke the handler
  });
