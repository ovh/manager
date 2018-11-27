import angular from 'angular';
import controller from './telecom-sms-options-response.controller';
import template from './telecom-sms-options-response.html';

const moduleName = 'ovhManagerSmsOptionsResponse';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('telecom.sms.options.response', {
    url: '/response',
    views: {
      'smsView@telecom.sms': {
        template,
        controller,
        controllerAs: 'TelecomSmsOptionsResponseCtrl',
      },
    },
    translations: ['.'],
  });
});

export default moduleName;
