import 'script-loader!jquery'; // eslint-disable-line

import angular from 'angular';
import ovhManagerCore from '@ovh-ux/manager-core';
import ssoAuth from '@ovh-ux/ng-ovh-sso-auth';
import orderTracking from '@ovh-ux/order-tracking';

import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';

angular.module('orderTrackingApp', [
  orderTracking,
  ovhManagerCore,
  'oui',
  ssoAuth,
]).config(/* @ngInject */($stateProvider) => {
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
      template: `
        <order-tracking-component order-id="$ctrl.orderId"
                                  billing-url="'#/billing/history'">
        </order-tracking-component>`,
      controller: /* @ngInject */ function controller(orderId) {
        this.$onInit = function $onInit() {
          this.orderId = orderId;
        };
      },
      controllerAs: '$ctrl',
      resolve: {
        orderId: /* @ngInject */ $transition$ => $transition$.params().orderId,
      },
    });
}).run(/* @ngInject */ ($translate, $transitions) => {
  $transitions.onBefore({ to: 'order.**' }, () => $translate.refresh());
});
