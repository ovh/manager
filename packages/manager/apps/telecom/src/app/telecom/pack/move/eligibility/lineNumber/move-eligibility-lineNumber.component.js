import controller from './move-eligibility-lineNumber.controller';
import template from './move-eligibility-lineNumber.html';

export default {
  bindings: {
    offers: '=?',
    offersChange: '&',
    method: '=?',
    packName: '<',
  },
  controller,
  template,
};
