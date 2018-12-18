import angular from 'angular';
import '@uirouter/angularjs';

import controller from './telecom-sms-order.controller';
import template from './telecom-sms-order.html';

const moduleName = 'ovhManagerSmsOrderComponent';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(($stateProvider) => {
    $stateProvider.state('sms.order', {
      url: '/order',
      views: {
        'smsInnerView@sms': {
          template,
          controller,
          controllerAs: 'SmsOrder',
        },
      },
      translations: ['.'],
    });
  }).constant('SMS_ORDER_PREFIELDS_VALUES', [
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
