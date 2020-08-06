import angular from 'angular';
import '@uirouter/angularjs';

import controller from './telecom-sms-guides.controller';
import template from './telecom-sms-guides.html';

const moduleName = 'ovhManagerSmsGuidesComponent';

angular
  .module(moduleName, ['ui.router'])
  .config(($stateProvider) => {
    $stateProvider.state('sms.service.guides', {
      url: '/guides',
      views: {
        smsInnerView: {
          template,
          controller,
          controllerAs: 'SmsGuidesCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('sms_guides_breadcrumb'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
