import angular from 'angular';
import controller from './telecom-sms-options-callback.controller';
import template from './telecom-sms-options-callback.html';

const moduleName = 'ovhManageSmsOptionsCallback';

angular
  .module(moduleName, [])
  .config(($stateProvider) => {
    $stateProvider.state('sms.service.options.callback', {
      url: '/callback',
      views: {
        'smsView@sms.service': {
          template,
          controller,
          controllerAs: 'TelecomSmsOptionsCallbackCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('sms_options_callback_title'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
