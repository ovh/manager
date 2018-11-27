import angular from 'angular';
import controller from './telecom-sms-options-manage.controller';
import template from './telecom-sms-options-manage.html';

const moduleName = 'ovhManageSmsOptionsManage';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('telecom.sms.options.manage', {
    url: '/manage',
    views: {
      'smsView@telecom.sms': {
        template,
        controller,
        controllerAs: 'TelecomSmsOptionsManageCtrl',
      },
    },
    translations: ['.'],
  });
});

export default moduleName;
