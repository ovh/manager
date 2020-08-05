import angular from 'angular';
import controller from './telecom-sms-options-manage.controller';
import template from './telecom-sms-options-manage.html';

const moduleName = 'ovhManageSmsOptionsManage';

angular.module(moduleName, []).config(($stateProvider) => {
  $stateProvider
    .state('sms.service.options.manage', {
      url: '/manage',
      views: {
        'smsView@sms.service': {
          template,
          controller,
          controllerAs: 'TelecomSmsOptionsManageCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('sms_options_manage_title'),
      },
    })
    .run(/* @ngTranslationsInject:json ./translations */);
});

export default moduleName;
