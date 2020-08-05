angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state('telecom.telephony.billingAccount.alias', {
      url: '/alias',
      template: '<div ui-view></div>',
      redirectTo: 'telecom.telephony.billingAccount.services',
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_alias_breadcrumb'),
      },
    });
    $stateProvider.state('telecom.telephony.billingAccount.alias.details', {
      url: '/:serviceName',
      views: {
        'telephonyView@telecom.telephony': {
          templateUrl:
            'app/telecom/telephony/alias/telecom-telephony-alias.html',
        },
        'aliasView@telecom.telephony.billingAccount.alias.details': {
          templateUrl:
            'app/telecom/telephony/alias/telecom-telephony-alias-main.view.html',
          controller: 'TelecomTelephonyAliasCtrl',
          controllerAs: '$ctrl',
        },
      },
      redirectTo: 'telecom.telephony.billingAccount.alias.details.dashboard',
      resolve: {
        serviceName: /* @ngInject */ ($transition$) =>
          $transition$.params().serviceName,
        breadcrumb: /* @ngInject */ (serviceName) => serviceName,
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
