import angular from 'angular';
import '@uirouter/angularjs';

import controller from './telecom-sms-guides.controller';
import template from './telecom-sms-guides.html';

const moduleName = 'ovhManagerSmsGuidesComponent';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(($stateProvider) => {
    $stateProvider.state('sms.guides', {
      url: '/guides',
      views: {
        'smsInnerView@sms': {
          template,
          controller,
          controllerAs: 'SmsGuidesCtrl',
        },
      },
      translations: ['.'],
    });
  });

export default moduleName;
