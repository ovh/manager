import angular from 'angular';
import controller from './telecom-sms-senders-blacklisted.controller';
import template from './telecom-sms-senders-blacklisted.html';

const moduleName = 'ovhManagerSmsSendersBlacklisted';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('sms.service.senders.blacklisted', {
    url: '/blacklisted',
    views: {
      'smsView@sms.service': {
        template,
        controller,
        controllerAs: 'SmsSendersBlacklistedCtrl',
      },
    },
    translations: ['.'],
  });
});

export default moduleName;
