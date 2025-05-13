import clone from 'lodash/clone';
import template from './emailpro-account.html';

const state = {
  url: '/account',
  template,
  controller: 'EmailProTabAccountsCtrl',
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('email-pro.dashboard.account', {
    ...clone(state),
    resolve: {
      goToAccounts: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('email-pro.dashboard.account', $transition$.params()),
      goToAliases: /* @ngInject */ ($state, $transition$) => (account) =>
        $state.go('email-pro.dashboard.account.email.alias', {
          ...$transition$.params(),
          emailAddress: account.primaryEmailAddress,
          account: account.primaryEmailAddress,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('emailpro_accounts'),
    },
  });
  $stateProvider.state('mxplan.dashboard.account', {
    ...clone(state),
    resolve: {
      goToAccounts: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('mxplan.dashboard.account', $transition$.params()),
      goToAliases: /* @ngInject */ ($state, $transition$) => (account) =>
        $state.go('mxplan.dashboard.account.email.alias', {
          ...$transition$.params(),
          emailAddress: account.primaryEmailAddress,
          account: account.primaryEmailAddress,
        }),
      breadcrumb: /* @ngInject */ ($translate) =>
        $translate.instant('emailpro_accounts'),
    },
  });

  $stateProvider.state('email-pro.dashboard.account.email', {
    url: '/:account',
    template: '<div ui-view></div>',
    redirectTo: 'email-pro.dashboard.account',
    resolve: {
      breadcrumb: /* @ngInject */ ($transition$) =>
        $transition$.params().account,
    },
  });

  $stateProvider.state('mxplan.dashboard.account.email', {
    url: '/:account',
    template: '<div ui-view></div>',
    redirectTo: 'mxplan.dashboard.account',
    resolve: {
      breadcrumb: /* @ngInject */ ($transition$) =>
        $transition$.params().account,
    },
  });
};
