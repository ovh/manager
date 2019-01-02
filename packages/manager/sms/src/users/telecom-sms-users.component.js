import angular from 'angular';
import '@uirouter/angularjs';

import controller from './telecom-sms-users.controller';
import template from './telecom-sms-users.html';

const moduleName = 'ovhManagerSmsSmsUsersComponent';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(($stateProvider) => {
    $stateProvider.state('sms.users', {
      url: '/users',
      views: {
        'smsInnerView@sms': {
          template,
          controller,
          controllerAs: 'SmsUsersCtrl',
        },
      },
      translations: [
        '.',
      ],
    });
  });

export default moduleName;
