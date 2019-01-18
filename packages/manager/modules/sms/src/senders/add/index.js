import angular from 'angular';
import controller from './telecom-sms-senders-add.controller';
import template from './telecom-sms-senders-add.html';

const moduleName = 'ovhManagerSmsSendersAdd';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('sms.service.senders.add', {
    url: '/add',
    views: {
      'smsView@sms': {
        template,
        controller,
        controllerAs: 'SmsSendersAddCtrl',
      },
    },
  });
});

export default moduleName;
