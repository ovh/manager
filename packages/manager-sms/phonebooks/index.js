import angular from 'angular';
import controller from './telecom-sms-phonebooks.controller';
import template from './telecom-sms-phonebooks.html';

import create from './create';

const moduleName = 'ovhManagerSmsPhonebooks';

angular.module(moduleName, [
  create,
]).config(($stateProvider) => {
  $stateProvider.state('telecom.sms.phonebooks', {
    url: '/phonebooks',
    views: {
      'smsInnerView@telecom.sms': {
        template,
        controller,
        controllerAs: 'PhonebooksCtrl',
      },
    },
    params: {
      bookKey: null,
    },
    translations: ['.'],
  });
});

export default moduleName;
