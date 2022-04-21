import { unescapeDescription } from '../account.constants';

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('exchange.dashboard.account.update', {
    url: '/update',
    component: 'exchangeAccountUpdate',
    params: {
      emailAccount: null,
    },
    redirectTo: (transition) =>
      transition
        .injector()
        .getAsync('emailAccount')
        .then((emailAccount) => {
          return !emailAccount ? 'exchange.dashboard.account' : '';
        }),
    resolve: {
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('exchange_account_update'),

      goBack: /* @ngInject */ ($state) => () => $state.go('^'),

      emailAccount: /* @ngInject */ ($transition$) => {
        const { emailAccount } = $transition$.params();
        return emailAccount
          ? {
              ...emailAccount,
              description: unescapeDescription(emailAccount.description),
            }
          : null;
      },
    },
  });
};
