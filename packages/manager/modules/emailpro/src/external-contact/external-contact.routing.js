import clone from 'lodash/clone';
import template from './emailpro-external-contact.html';

const state = {
  url: '/external-contact',
  template,
  controller: 'EmailProTabExternalContactsCtrl',
};

export default /* @ngInject */ ($stateProvider) => {
  $stateProvider.state('email-pro.dashboard.external-contact', clone(state));
  $stateProvider.state('mxplan.dashboard.external-contact', clone(state));
};
