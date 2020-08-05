import angular from 'angular';

import controller from './telecom-sms-sms-outgoing.controller';
import template from './telecom-sms-sms-outgoing.html';

const moduleName = 'ovhManagerSmsSmsOutgoing';

angular
  .module(moduleName, [])
  .config(($stateProvider) => {
    $stateProvider.state('sms.service.sms.outgoing', {
      url: '/outgoing',
      views: {
        'smsView@sms.service': {
          template,
          controller,
          controllerAs: 'SmsOutgoingCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('sms_sms_outgoing_title'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
