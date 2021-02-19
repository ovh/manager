import angular from 'angular';
import '@uirouter/angularjs';
import '@ovh-ux/ng-at-internet';

import controller from './telecom-sms-sms.controller';
import template from './telecom-sms-sms.html';

import compose from './compose';
import hlr from './hlr';
import incoming from './incoming';
import outgoing from './outgoing';
import pending from './pending';
import templates from './templates';

const moduleName = 'ovhManagerSmsSmsComponent';

angular
  .module(moduleName, [
    'ui.router',
    'ngAtInternet',
    compose,
    hlr,
    incoming,
    outgoing,
    pending,
    templates,
  ])
  .config(($stateProvider) => {
    $stateProvider.state('sms.service.sms', {
      url: '/sms',
      views: {
        smsInnerView: {
          template,
          controller,
          controllerAs: 'TelecomSmsSmsCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('sms_sms_breadcrumb'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
