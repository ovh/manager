import angular from 'angular';
import '@uirouter/angularjs';

import controller from './telecom-sms-receivers.controller';
import template from './telecom-sms-receivers.html';

const moduleName = 'ovhManagerSmsReceiversComponent';

angular
  .module(moduleName, ['ui.router'])
  .config(($stateProvider) => {
    $stateProvider.state('sms.service.receivers', {
      url: '/receivers',
      views: {
        smsInnerView: {
          template,
          controller,
          controllerAs: 'SmsReceiversCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('sms_receivers_breadcrumb'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
