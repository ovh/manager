angular.module('managerApp').config(($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount.fax', {
    url: '/fax',
    template: '<div ui-view></div>',
    redirectTo: 'telecom.telephony.billingAccount.services',
  });

  $stateProvider.state('telecom.telephony.billingAccount.fax.dashboard', {
    url: '/:serviceName',
    views: {
      'telephonyView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/fax/telecom-telephony-fax.html',
      },
      'faxView@telecom.telephony.billingAccount.fax.dashboard': {
        templateUrl:
          'app/telecom/telephony/fax/telecom-telephony-fax-main-view.html',
        controller: 'TelecomTelephonyFaxCtrl',
        controllerAs: '$ctrl',
      },
      'faxInnerView@telecom.telephony.billingAccount.fax.dashboard': {
        templateUrl:
          'app/telecom/telephony/fax/management/telecom-telephony-fax-management.html',
        controller: 'TelecomTelephonyFaxManagementCtrl',
        controllerAs: '$ctrl',
      },
    },
    translations: { value: ['.', './management'], format: 'json' },
    resolve: {
      $title(translations, $translate, $stateParams) {
        return $translate('telephony_fax_page_title', {
          name: $stateParams.serviceName,
        });
      },
      faxDashboardLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.fax.dashboard',
          $transition$.params(),
        ),
      consumptionLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.fax.dashboard.consumption',
          $transition$.params(),
        ),
      voicemailLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.fax.dashboard.voicemail',
          $transition$.params(),
        ),
      faxLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.fax.dashboard.fax',
          $transition$.params(),
        ),
      contactLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.fax.dashboard.contact',
          $transition$.params(),
        ),
      assistLink: /* @ngInject */ ($state, $transition$) =>
        $state.href(
          'telecom.telephony.billingAccount.fax.dashboard.assist',
          $transition$.params(),
        ),

      currentActiveLink: /* @ngInject */ ($state, $transition$) => () =>
        $state.href($state.current.name, $transition$),
    },
  });
});
