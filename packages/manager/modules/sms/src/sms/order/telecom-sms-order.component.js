import angular from 'angular';
import '@ovh-ux/manager-core';
import '@ovh-ux/manager-telecom-styles';
import '@ovh-ux/ng-ovh-contracts';
import '@ovh-ux/ng-ovh-telecom-universe-components';
import '@uirouter/angularjs';
import '@ovh-ux/ng-at-internet';
import 'ovh-api-services';

import '@ovh-ux/ui-kit/dist/css/oui.css';
import 'ovh-ui-kit-bs/dist/css/oui-bs3.css';
import 'ovh-manager-webfont/dist/css/ovh-font.css';
import 'font-awesome/css/font-awesome.css';

import controller from './telecom-sms-order.controller';
import templateService from './telecom-sms-order-service.html';
import template from './telecom-sms-order.html';

import '../telecom-sms.scss';

const moduleName = 'ovhManagerSmsOrderComponent';

angular
  .module(moduleName, [
    'ui.router',
    'ngAtInternet',
    'ngOvhContracts',
    'ovh-api-services',
    'ovhManagerCore',
    'ngOvhTelecomUniverseComponents',
  ])
  .component('smsOrderComponent', {
    controller,
    template: templateService,
  })
  .config(($stateProvider) => {
    $stateProvider.state('sms.service.order', {
      url: '/order',
      views: {
        smsInnerView: {
          component: 'smsOrderComponent',
        },
      },
      translations: { value: ['.'], format: 'json' },
    });

    $stateProvider.state('sms.order', {
      url: '/order',
      views: {
        '': {
          template,
        },
        'smsOrderView@sms.order': {
          component: 'smsOrderComponent',
        },
      },
      translations: { value: ['.'], format: 'json' },
    });
  })
  .constant('SMS_ORDER_PREFIELDS_VALUES', [
    100,
    500,
    1000,
    5000,
    10000,
    50000,
    100000,
    500000,
    NaN,
  ]);

export default moduleName;
