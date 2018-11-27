import angular from 'angular';
import controller from './telecom-sms-options-recredit.controller';
import template from './telecom-sms-options-recredit.html';

const moduleName = 'ovhManagerSmsOptionsRecredit';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('telecom.sms.options.recredit', {
    url: '/recredit',
    views: {
      'smsView@telecom.sms': {
        template,
        controller,
        controllerAs: 'TelecomSmsOptionsRecreditCtrl',
      },
    },
    translations: ['.'],
  });
});

export default moduleName;
