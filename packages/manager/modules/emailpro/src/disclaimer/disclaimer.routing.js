import clone from 'lodash/clone';
import template from './emailpro-disclaimer.html';

const state = {
  url: '/disclaimer',
  template,
  controller: 'EmailProDisclaimerCtrl',
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('email-pro.dashboard.disclaimer', clone(state));
  $stateProvider.state('mxplan.dashboard.disclaimer', clone(state));
};
