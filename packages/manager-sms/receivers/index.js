import angular from 'angular';

import controller from './telecom-sms-receivers.controller';
import template from './telecom-sms-receivers.html';

const moduleName = 'ovhManagerSmsReceivers';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('telecom.sms.receivers', {
    url: '/receivers',
    views: {
      'smsInnerView@telecom.sms': {
        template,
        controller,
        controllerAs: 'SmsReceiversCtrl',
      },
    },
    translations: ['.'],
  });
});

export default moduleName;
