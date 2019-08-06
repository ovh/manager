import 'script-loader!jquery'; // eslint-disable-line

import angular from 'angular';
import ovhManagerCore from '@ovh-ux/manager-core';
import { module as orderTracking } from '@ovh-ux/order-tracking';

import 'angular-ui-bootstrap';

import './index.scss';
import 'ovh-ui-kit/dist/oui.css';
import 'ovh-ui-kit-bs/dist/ovh-ui-kit-bs.css';

angular.module('orderTrackingApp', [
  orderTracking,
  ovhManagerCore,
  'oui',
  'ui.bootstrap',
]).config(/* @ngInject */($stateProvider) => {
  $stateProvider
    .state('app', {
      url: '/:orderId',
      template: '<order-tracking-component order-id="$ctrl.orderId"></order-tracking-component>',
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
