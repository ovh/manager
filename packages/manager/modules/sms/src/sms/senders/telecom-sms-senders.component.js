import angular from 'angular';
import '@uirouter/angularjs';

import controller from './telecom-sms-senders.controller';
import template from './telecom-sms-senders.html';

import add from './add';

const moduleName = 'ovhManagerSmsSendersComponent';

angular
  .module(moduleName, ['ui.router', add])
  .config(($stateProvider) => {
    $stateProvider.state('sms.service.senders', {
      url: '/senders',
      views: {
        smsInnerView: {
          template,
          controller,
          controllerAs: 'SmsSendersCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('sms_senders_breadcrumb'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */)
  .run(/* @ngTranslationsInject:json ./add/translations */);

export default moduleName;
