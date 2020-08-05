angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.fax.dashboard.management.informations',
      {
        url: '/informations',
        views: {
          'faxView@telecom.telephony.billingAccount.fax.dashboard': {
            templateUrl:
              'app/telecom/telephony/fax/management/informations/telecom-telephony-fax-management-informations.html',
            controller: 'TelecomTelephonyFaxManagementInformationsCtrl',
            controllerAs: '$ctrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_group_fax_management_informations_main',
            ),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
