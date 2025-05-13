import angular from 'angular';
import controller from './telecom-sms-sms-hlr.controller';
import template from './telecom-sms-sms-hlr.html';

const moduleName = 'ovhManagerSmsSmsHlr';

angular
  .module(moduleName, [])
  .config(($stateProvider) => {
    $stateProvider.state('sms.service.sms.hlr', {
      url: '/hlr',
      views: {
        'smsView@sms.service': {
          template,
          controller,
          controllerAs: 'SmsHlrCtrl',
        },
      },
      resolve: {
        goBack: /* @ngInject */ ($state, $transition$) => () =>
          $state.go($transition$.from().name || '^'),
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('sms_sms_hlr_title'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ../../dashboard/translations */);

export default moduleName;
