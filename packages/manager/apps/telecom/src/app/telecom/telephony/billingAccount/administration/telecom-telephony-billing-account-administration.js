angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state('telecom.telephony.billingAccount.administration', {
      url: '/administration',
      views: {
        'groupInnerView@telecom.telephony.billingAccount': {
          templateUrl:
            'app/telecom/telephony/billingAccount/administration/telecom-telephony-billing-account-administration.html',
          controller: 'TelecomTelephonyBillingAccountAdministrationCtrl',
          controllerAs: 'BillingAccountAdministrationCtrl',
        },
      },
      translations: { value: ['../billing'], format: 'json' },
      resolve: {
        breadcrumb: /* @ngInject */ ($translate) =>
          $translate.instant('telephony_group_admin_breadcrumb'),
      },
    });
  })
  .run(/* @ngTranslationsInject:json ./translations */);
