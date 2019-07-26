import angular from 'angular';
import controller from './telecom-sms-options-manage.controller';
import template from './telecom-sms-options-manage.html';

const moduleName = 'ovhManageSmsOptionsManage';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider.state('sms.service.options.manage', {
    url: '/manage',
    views: {
      'smsView@sms.service': {
        template,
        controller,
        controllerAs: 'TelecomSmsOptionsManageCtrl',
      },
    },
    translations: { value: ['.'], format: 'json' },
  });
});

export default moduleName;
