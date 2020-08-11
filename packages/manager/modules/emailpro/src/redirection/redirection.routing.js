import clone from 'lodash/clone';
import template from './emailpro-redirection.html';

const state = {
  url: '/redirection',
  template,
  controller: 'EmailMXPlanEmailRedirectionCtrl',
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('mxplan.dashboard.redirection', clone(state));
};
