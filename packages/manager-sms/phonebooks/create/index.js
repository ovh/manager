import angular from 'angular';

import controller from './telecom-sms-phonebooks-create.controller';
import template from './telecom-sms-phonebooks-create.html';

const moduleName = 'ovhModuleSmsPhonebooksCreate';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('telecom.sms.phonebooks.create', {
    url: '/create',
    views: {
      'smsView@telecom.sms': {
        template,
        controller,
        controllerAs: 'PhonebooksCreateCtrl',
      },
    },
    translations: ['.'],
  });
});

export default moduleName;
