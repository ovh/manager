import angular from 'angular';

import controller from './telecom-sms-sms-outgoing.controller';
import template from './telecom-sms-sms-outgoing.html';

const moduleName = 'ovhManagerSmsSmsOutgoing';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('telecom.sms.sms.outgoing', {
    url: '/outgoing',
    views: {
      'smsView@telecom.sms': {
        template,
        controller,
        controllerAs: 'SmsOutgoingCtrl',
      },
    },
    translations: ['.'],
  });
});

export default moduleName;
