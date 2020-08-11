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
      goToAliases: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('email-pro.dashboard.account.alias', $transition$.params()),
    },
  });
  $stateProvider.state('mxplan.dashboard.account', {
    ...clone(state),
    resolve: {
      goToAccounts: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('mxplan.dashboard.account', $transition$.params()),
      goToAliases: /* @ngInject */ ($state, $transition$) => () =>
        $state.go('mxplan.dashboard.account.alias', $transition$.params()),
    },
  });
};
