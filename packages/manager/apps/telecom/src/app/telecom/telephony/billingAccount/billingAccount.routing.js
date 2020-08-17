export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('telecom.telephony.billingAccount', {
    url: '/:billingAccount',
    views: {
      'telephonyView@telecom.telephony': {
        templateUrl: 'app/telecom/telephony/telecom-telephony-main.view.html',
      },
      'groupView@telecom.telephony.billingAccount': {
        templateUrl:
          'app/telecom/telephony/billingAccount/telecom-telephony-billing-account.html',
        controller: 'TelecomTelephonyBillingAccountCtrl',
        controllerAs: 'BillingAccountCtrl',
      },
      'groupInnerView@telecom.telephony.billingAccount': {
        templateUrl:
          'app/telecom/telephony/billingAccount/dashboard/telecom-telephony-billing-account-dashboard.html',
        controller: 'TelecomTelephonyBillingAccountDashboardCtrl',
        controllerAs: 'DashboardCtrl',
      },
    },
    resolve: {
      billingAccount: /* @ngInject */ ($transition$) =>
        $transition$.params().billingAccount,
      billingAccountId: /* @ngInject */ (billingAccount) => billingAccount,
      initTelephony($q, $stateParams, TelephonyMediator) {
        // init all groups, lines and numbers
        TelephonyMediator.init().then(() =>
          TelephonyMediator.getGroup(
            $stateParams.billingAccount,
          ).then((group) => TelephonyMediator.setCurrentGroup(group)),
        );
        return $q.when({ init: true });
      },
      $title(translations, $translate, $stateParams, OvhApiTelephony) {
        return OvhApiTelephony.v6()
          .get({
            billingAccount: $stateParams.billingAccount,
          })
          .$promise.then((data) =>
            $translate.instant(
              'telephony_page_title',
              { name: data.description || $stateParams.billingAccount },
              null,
              null,
              'escape',
            ),
          )
          .catch(() =>
            $translate('telephony_page_title', {
              name: $stateParams.billingAccount,
            }),
          );
      },
      currentActiveLink: /* @ngInject */ ($transition$, $state) => () =>
        $state.href($state.current.name, $transition$.params()),

      billingAccountLink: /* @ngInject */ ($state, billingAccountId) =>
        $state.href('telecom.telephony.billingAccount', {
          billingAccount: billingAccountId,
        }),
      servicesLink: /* @ngInject */ ($state, billingAccountId) =>
        $state.href('telecom.telephony.billingAccount.services', {
          billingAccount: billingAccountId,
        }),
      administrationLink: /* @ngInject */ ($state, billingAccountId) =>
        $state.href('telecom.telephony.billingAccount.administration', {
          billingAccount: billingAccountId,
        }),
      billingLink: /* @ngInject */ ($state, billingAccountId) =>
        $state.href('telecom.telephony.billingAccount.billing', {
          billingAccount: billingAccountId,
        }),
      orderAliasLink: /* @ngInject */ ($state, billingAccountId) =>
        $state.href('telecom.telephony.billingAccount.orderAlias', {
          billingAccount: billingAccountId,
        }),
      phonebookLink: /* @ngInject */ ($state, billingAccountId) =>
        $state.href('telecom.telephony.billingAccount.phonebook', {
          billingAccount: billingAccountId,
        }),
      abbreviatedNumbersLink: /* @ngInject */ ($state, billingAccountId) =>
        $state.href('telecom.telephony.billingAccount.abbreviatedNumbers', {
          billingAccount: billingAccountId,
        }),
      manageContactsLink: /* @ngInject */ ($state, billingAccountId) =>
        $state.href('telecom.telephony.billingAccount.manageContacts', {
          billingAccount: billingAccountId,
        }),
      guidesLink: /* @ngInject */ ($state, billingAccountId) =>
        $state.href('telecom.telephony.billingAccount.guides', {
          billingAccount: billingAccountId,
        }),
    },
    translations: { value: ['..', '.', './dashboard'], format: 'json' },
  });
};
