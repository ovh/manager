import angular from 'angular';
import controller from './telecom-sms-configure-time2chat.controller';
import template from './telecom-sms-configure-time2chat.html';

const moduleName = 'ovhManagerSmsSendersConfigureTime2ChatCtrl';

angular
  .module(moduleName, [])
  .config(($stateProvider) => {
    $stateProvider.state('sms.service.senders.configure-time2chat', {
      url: '/:number/configure',
      views: {
        'smsView@sms.service': {
          template,
          controller,
          controllerAs: 'SmsSendersConfigureTime2ChatCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('sms_senders_configure_time2chat'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
