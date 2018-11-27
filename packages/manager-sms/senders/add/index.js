import angular from 'angular';
import controller from './telecom-sms-senders-add.controller';
import template from './telecom-sms-senders-add.html';

const moduleName = 'ovhManagerSmsSendersAdd';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('telecom.sms.senders.add', {
    url: '/add',
    views: {
      'smsView@telecom.sms': {
        template,
        controller,
        controllerAs: 'SmsSendersAddCtrl',
      },
    },
  });
});

export default moduleName;
