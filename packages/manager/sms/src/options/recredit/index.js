import angular from 'angular';
import controller from './telecom-sms-options-recredit.controller';
import template from './telecom-sms-options-recredit.html';

const moduleName = 'ovhManagerSmsOptionsRecredit';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('sms.options.recredit', {
    url: '/recredit',
    views: {
      'smsView@sms': {
        template,
        controller,
        controllerAs: 'TelecomSmsOptionsRecreditCtrl',
      },
    },
    translations: ['.'],
  });
});

export default moduleName;
