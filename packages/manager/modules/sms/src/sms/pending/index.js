import angular from 'angular';

import controller from './telecom-sms-sms-pending.controller';
import template from './telecom-sms-sms-pending.html';

const moduleName = 'ovhManagerSmsSmsPending';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('sms.service.sms.pending', {
    url: '/pending',
    views: {
      'smsView@sms.service': {
        template,
        controller,
        controllerAs: 'SmsPendingCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});

export default moduleName;
