angular.module('managerApp').config(($stateProvider) => {
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
      translations: { value: ['.'], format: 'json' },
    },
  );
});
