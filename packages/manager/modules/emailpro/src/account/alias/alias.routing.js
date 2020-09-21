import clone from 'lodash/clone';
import template from './emailpro-account-alias.html';

const state = {
  url: '/alias',
  template,
  controller: 'EmailProTabAliasCtrl',
  resolve: {
    breadcrumb: /* @ngInject */ ($translate) =>
      $translate.instant('emailpro_accounts_add'),
  },
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('email-pro.dashboard.account.email.alias', clone(state));
  $stateProvider.state('mxplan.dashboard.account.email.alias', clone(state));
};
