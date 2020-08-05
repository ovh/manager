angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.administration.linesGroup',
      {
        url: '/linesGroup',
        views: {
          'groupView@telecom.telephony.billingAccount': {
            templateUrl:
              'app/telecom/telephony/billingAccount/administration/linesGroup/telecom-telephony-billing-account-administration-lines-group.html',
            controller:
              'TelecomTelephonyBillingAccountAdministrationLinesGroup',
            controllerAs: 'LinesGroupCtrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant('telephony_lines_group_title'),
        },
        translations: { value: ['..'], format: 'json' },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
