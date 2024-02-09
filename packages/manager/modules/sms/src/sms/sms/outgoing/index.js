import angular from 'angular';

import component from './telecom-sms-sms-outgoing.component';

const moduleName = 'ovhManagerSmsSmsOutgoing';

angular
  .module(moduleName, [])
  .config(($stateProvider) => {
    $stateProvider.state('sms.service.sms.outgoing', {
      url: '/outgoing',
      views: {
        'smsView@sms.service': {
          component: 'ovhManagerSmsSmsOutgoing',
        },
      },
      resolve: {
        getOutgoingSms: /* @ngInject */ (SmsService, serviceName) => (params) =>
          SmsService.getOutgoingSms(serviceName, params),
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('sms_sms_outgoing_title'),
      },
    });
  })
  .component('ovhManagerSmsSmsOutgoing', component)
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
