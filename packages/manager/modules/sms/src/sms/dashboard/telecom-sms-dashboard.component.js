import angular from 'angular';
import '@uirouter/angularjs';

import template from './telecom-sms-dashboard.html';
import controller from './telecom-sms-dashboard.controller';

const moduleName = 'ovhManagerSmsDashboardComponent';

angular.module(moduleName, ['ui.router']).config(($stateProvider) => {
  $stateProvider.state('sms.service.dashboard', {
    url: '',
    views: {
      smsInnerView: {
        template,
        controller,
        controllerAs: 'SmsDashboardCtrl',
      },
    },
    translations: {
      value: ['.', '../sms/compose'],
      format: 'json',
    },
  });
});

export default moduleName;
