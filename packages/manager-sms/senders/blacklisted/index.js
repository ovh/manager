import angular from 'angular';
import controller from './telecom-sms-senders-blacklisted.controller';
import template from './telecom-sms-senders-blacklisted.html';

const moduleName = 'ovhManagerSmsSendersBlacklisted';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('telecom.sms.senders.blacklisted', {
    url: '/blacklisted',
    views: {
      'smsView@telecom.sms': {
        template,
        controller,
        controllerAs: 'SmsSendersBlacklistedCtrl',
      },
    },
    translations: ['.'],
  });
});

export default moduleName;
