import angular from 'angular';
import controller from './telecom-sms-guides.controller';
import template from './telecom-sms-guides.html';

const moduleName = 'ovhManagerSmsGuides';

angular.module(moduleName, []).config(($stateProvider) => {
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
