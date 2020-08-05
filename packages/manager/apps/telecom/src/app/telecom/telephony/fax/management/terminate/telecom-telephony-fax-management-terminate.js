angular
  .module('managerApp')
  .config(($stateProvider) => {
    $stateProvider.state(
      'telecom.telephony.billingAccount.fax.dashboard.management.terminate',
      {
        url: '/terminate',
        views: {
          'faxView@telecom.telephony.billingAccount.fax.dashboard': {
            templateUrl:
              'app/telecom/telephony/fax/management/terminate/telecom-telephony-fax-management-terminate.html',
            controller: 'TelecomTelephonyFaxManagementTerminateCtrl',
            controllerAs: '$ctrl',
          },
        },
        resolve: {
          breadcrumb: /* @ngInject */ ($translate) =>
            $translate.instant(
              'telephony_group_fax_management_terminate_breadcrumb',
            ),
        },
      },
    );
  })
  .run(/* @ngTranslationsInject:json ./translations */);
