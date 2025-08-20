import angular from 'angular';
import '@uirouter/angularjs';

import controller from './telecom-sms-senders.controller';
import template from './telecom-sms-senders.html';

import add from './add';
import configureTime2Chat from './configure-time2chat';

const moduleName = 'ovhManagerSmsSendersComponent';

angular
  .module(moduleName, ['ui.router', add, configureTime2Chat])
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
  .run(/* @ngTranslationsInject:json ./add/translations */)
  .run(/* @ngTranslationsInject:json ./configure-time2chat/translations */);

export default moduleName;
