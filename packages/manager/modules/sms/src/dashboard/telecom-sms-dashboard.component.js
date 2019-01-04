import angular from 'angular';
import '@uirouter/angularjs';

import template from './telecom-sms-dashboard.html';
import controller from './telecom-sms-dashboard.controller';

const moduleName = 'ovhManagerSmsDashboardComponent';

angular
  .module(moduleName, [
    'ui.router',
  ])
  .config(($stateProvider) => {
    $stateProvider.state('sms.dashboard', {
      url: '',
      views: {
        'smsInnerView@sms': {
          template,
          controller,
          controllerAs: 'SmsDashboardCtrl',
        },
      },
      translations: ['.', '../sms/compose'],
    });
  });

export default moduleName;
