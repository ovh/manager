import angular from 'angular';
import template from './telecom-sms-dashboard.html';
import controller from './telecom-sms-dashboard.controller';

const moduleName = 'ovhManagerSmsDashboard';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('telecom.sms.dashboard', {
    url: '',
    views: {
      'smsInnerView@telecom.sms': {
        template,
        controller,
        controllerAs: 'SmsDashboardCtrl',
      },
    },
    translations: ['.', '../sms/compose'],
  });
});

export default moduleName;
