import controller from './pack-move-eligibility-address.controller';
import template from './pack-move-eligibility-address.html';

const component = {
  bindings: {
    address: '=?',
    offersChange: '&',
    submited: '&',
    method: '=?',
  },
  template,
  controller,
};

export default component;

angular.module('managerApp').component('packMoveEligibilityAddress', component);
