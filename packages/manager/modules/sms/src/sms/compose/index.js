import angular from 'angular';
import controller from './telecom-sms-sms-compose.controller';
import template from './telecom-sms-sms-compose.html';

import './addPhonebookContact/telecom-sms-sms-compose-addPhonebookContact.less';

const moduleName = 'ovhManagerSmsSmsCompose';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('sms.service.sms.compose', {
    url: '/compose',
    views: {
      'smsView@sms.service': {
        template,
        controller,
        controllerAs: 'SmsComposeCtrl',
      },
    },
    translations: ['../../../sms/dashboard', '.'],
  });
});

export default moduleName;
