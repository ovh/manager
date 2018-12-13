import angular from 'angular';

import controller from './telecom-sms-phonebooks-create.controller';
import template from './telecom-sms-phonebooks-create.html';

const moduleName = 'ovhModuleSmsPhonebooksCreate';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('sms.phonebooks.create', {
    url: '/create',
    views: {
      'smsView@sms': {
        template,
        controller,
        controllerAs: 'PhonebooksCreateCtrl',
      },
    },
    translations: ['.'],
  });
});

export default moduleName;
