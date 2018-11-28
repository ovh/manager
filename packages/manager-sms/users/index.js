import angular from 'angular';

import controller from './telecom-sms-users.controller';
import template from './telecom-sms-users.html';

const moduleName = 'ovhManagerSmsSmsUsers';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('telecom.sms.users', {
    url: '/users',
    views: {
      'smsInnerView@telecom.sms': {
        template,
        controller,
        controllerAs: 'SmsUsersCtrl',
      },
    },
    translations: [
      '../../sms/users',
    ],
  });
});

export default moduleName;
