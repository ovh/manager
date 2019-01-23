import angular from 'angular';
import controller from './telecom-sms-sms-hlr.controller';
import template from './telecom-sms-sms-hlr.html';

const moduleName = 'ovhManagerSmsSmsHlr';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('sms.service.sms.hlr', {
    url: '/hlr',
    views: {
      'smsView@sms': {
        template,
        controller,
        controllerAs: 'SmsHlrCtrl',
      },
    },
    translations: ['../../dashboard', '.'],
  });
});

export default moduleName;
