import angular from 'angular';
import controller from './telecom-sms-options-blacklist.controller';
import template from './telecom-sms-options-blacklist.html';

const moduleName = 'ovhManagerSmsOptionsBlacklist';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('sms.service.options.blacklist', {
    url: '/blacklist',
    views: {
      'smsView@sms.service': {
        template,
        controller,
        controllerAs: 'SmsOptionsBlacklistCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});

export default moduleName;
