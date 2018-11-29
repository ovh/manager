import angular from 'angular';
import controller from './telecom-sms-options.controller';
import template from './telecom-sms-options.html';

import manage from './manage';
import recredit from './recredit';
import response from './response';

const moduleName = 'ovhManagerSmsOptions';

angular.module(moduleName, [
  manage,
  recredit,
  response,
]).config(($stateProvider) => {
  $stateProvider.state('sms.options', {
    url: '/options',
    views: {
      'smsInnerView@sms': {
        template,
        controller,
        controllerAs: 'TelecomSmsOptionsCtrl',
      },
    },
    translations: ['.'],
  });
});

export default moduleName;
