import clone from 'lodash/clone';
import template from './emailpro-information.html';

const state = {
  url: '',
  template,
  controller: 'EmailProTabInformationCtrl',
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('email-pro.dashboard.information', clone(state));
  $stateProvider.state('mxplan.dashboard.information', clone(state));
};
