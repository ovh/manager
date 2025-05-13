import angular from 'angular';
import '@uirouter/angularjs';

import controller from './telecom-sms-users.controller';
import template from './telecom-sms-users.html';

const moduleName = 'ovhManagerSmsSmsUsersComponent';

angular
  .module(moduleName, ['ui.router'])
  .config(($stateProvider) => {
    $stateProvider.state('sms.service.users', {
      url: '/users',
      views: {
        smsInnerView: {
          template,
          controller,
          controllerAs: 'SmsUsersCtrl',
        },
      },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('sms_users_breadcrumb'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);

export default moduleName;
