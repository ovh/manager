import clone from 'lodash/clone';
import template from './emailpro-domain-add.html';

const state = {
  url: '/add',
  layout: 'modal',
  template,
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('email-pro.dashboard.domain.add', clone(state));
  $stateProvider.state('mxplan.dashboard.domain.add', clone(state));
};
