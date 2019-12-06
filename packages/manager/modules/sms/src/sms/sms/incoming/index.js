import angular from 'angular';

import controller from './telecom-sms-sms-incoming.controller';
import template from './telecom-sms-sms-incoming.html';

const moduleName = 'ovhManagerSmsSmsIncoming';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('sms.service.sms.incoming', {
    url: '/incoming',
    views: {
      'smsView@sms.service': {
        template,
        controller,
        controllerAs: 'SmsIncomingCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});

export default moduleName;
