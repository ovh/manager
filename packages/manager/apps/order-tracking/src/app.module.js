import 'script-loader!jquery'; // eslint-disable-line

import { isString, get } from 'lodash-es';

import angular from 'angular';
import { registerCoreModule } from '@ovh-ux/manager-core';
import ssoAuth from '@ovh-ux/ng-ovh-sso-auth';
import ngOvhOrderTracking from '@ovh-ux/ng-ovh-order-tracking';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';

export default (containerEl, environment) => {
  const moduleName = 'orderTrackingApp';
  angular
    .module(
      moduleName,
      [
        ngOvhOrderTracking,
        registerCoreModule(environment),
        'oui',
        ssoAuth,
        ...get(__NG_APP_INJECTIONS__, environment.getRegion(), []),
      ].filter(isString),
    )
    .config(
      /* @ngInject */ ($stateProvider) => {
        $stateProvider
          .state('home', {
            url: '',
            controller: /* @ngInject */ function ctrl($state) {
              this.onSubmit = function onSubmit() {
                $state.go('app', { orderId: this.orderId });
              };
            },
            controllerAs: '$ctrl',
            template: `<form class="m-4" novalidate data-ng-submit="$ctrl.onSubmit()">
        <oui-field label="Order ID" size="xl">
          <input class="oui-input" name="orderId" type="text" data-ng-model="$ctrl.orderId" placeholder="orderId">
        </oui-field>
        <oui-button type="submit" disabled="!$ctrl.orderId">Got to tracking</oui-button>
      </form>`,
          })
          .state('app', {
            url: '/:orderId',
            component: 'ovhOrderTrackingComponent',
            resolve: {
              orderId: /* @ngInject */ ($transition$) =>
                $transition$.params().orderId,
              billingUrl: () => '#/billing/history',
            },
          });
      },
    )
    .run(
      /* @ngInject */ ($rootScope, $transitions) => {
        const unregisterHook = $transitions.onSuccess({}, () => {
          $rootScope.$broadcast('app:started');
          unregisterHook();
        });
      },
    );

  angular.bootstrap(containerEl, [moduleName], {
    strictDi: true,
  });

  return moduleName;
};
