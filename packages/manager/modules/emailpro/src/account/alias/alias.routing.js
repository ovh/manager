import clone from 'lodash/clone';
import template from './emailpro-account-alias.html';

const state = {
  url: '/alias',
  template,
  controller: 'EmailProTabAliasCtrl',
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('email-pro.dashboard.account.alias', clone(state));
  $stateProvider.state('mxplan.dashboard.account.alias', clone(state));
};
