import controller from './move-eligibility-address.controller';
import template from './move-eligibility-address.html';

export default {
  bindings: {
    address: '=?',
    offersChange: '&',
    submited: '&',
    method: '=?',
    packName: '<',
  },
  template,
  controller,
};
