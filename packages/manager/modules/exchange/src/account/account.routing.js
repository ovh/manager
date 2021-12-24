import PHONE_PREFIX from '@ovh-ux/manager-phone-prefix';
import {
  ACCOUNT_COUNTRY_RULE_NAME,
  ACCOUNT_PHONE_RULE_NAME,
} from './account.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.account', {
    url: '/account',
    component: 'exchangeAccountHome',
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_account'),

      accountRules: /* @ngInject */ (ExchangeAccountService) => {
        return ExchangeAccountService.getAccountRules();
      },

      countries: /* @ngInject */ (accountRules, $translate) => {
        return accountRules
          .find(({ fieldName }) => fieldName === ACCOUNT_COUNTRY_RULE_NAME)
          ?.in.map((countryCode) => ({
            code: countryCode,
            label: $translate.instant(
              `exchange_account_country_${countryCode}`,
            ),
          }));
      },

      phoneCountries: /* @ngInject */ (accountRules) => {
        return accountRules
          .find(({ fieldName }) => fieldName === ACCOUNT_PHONE_RULE_NAME)
          ?.in.map((countryCode) => ({
            countryCode,
            telephonyCode: PHONE_PREFIX[countryCode],
          }));
      },

      goToAccounts: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('exchange.dashboard.account', $transition$.params()),

      goToAddAccount: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('exchange.dashboard.account.add', $transition$.params()),

      goToUpdateAccount: /* @ngInject */ ($state, $transition$) => (
        emailAccount,
      ) =>
        $state.go('exchange.dashboard.account.update', {
          ...$transition$.params(),
          emailAccount,
        }),

      goToAliasManagement: /* @ngInject */ ($state, $transition$) => (
        account,
      ) =>
        $state.go('exchange.dashboard.account.email.alias', {
          ...$transition$.params(),
          account,
          email: account.primaryEmailAddress,
        }),
    },
  });

  $stateProvider.state('exchange.dashboard.account.email', {
    url: '/:email',
    template: '<div ui-view></div>',
    redirectTo: 'exchange.dashboard.account',
    resolve: {
      email: /* @ngInject */ ($transition$) => $transition$.params().email,
      breadcrumb: /* @ngInject */ (email) => email,
    },
  });
};
