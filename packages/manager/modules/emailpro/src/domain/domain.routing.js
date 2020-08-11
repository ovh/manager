import clone from 'lodash/clone';
import template from './emailpro-domain.html';

const state = {
  url: '/domain',
  template,
  controller: 'EmailProTabDomainsCtrl',
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('email-pro.dashboard.domain', clone(state));
  $stateProvider.state('mxplan.dashboard.domain', clone(state));
};
