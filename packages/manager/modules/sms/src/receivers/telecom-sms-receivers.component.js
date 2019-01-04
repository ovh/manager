import angular from 'angular';
import '@uirouter/angularjs';

import controller from './telecom-sms-receivers.controller';
import template from './telecom-sms-receivers.html';

const moduleName = 'ovhManagerSmsReceiversComponent';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(($stateProvider) => {
    $stateProvider.state('sms.receivers', {
      url: '/receivers',
      views: {
        'smsInnerView@sms': {
          template,
          controller,
          controllerAs: 'SmsReceiversCtrl',
        },
      },
      translations: ['.'],
    });
  });

export default moduleName;
