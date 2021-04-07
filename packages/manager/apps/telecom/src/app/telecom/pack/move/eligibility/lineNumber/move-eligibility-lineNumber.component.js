import controller from './move-eligibility-lineNumber.controller';
import template from './move-eligibility-lineNumber.html';

export default {
  bindings: {
    isReseller: '<',
    offers: '=?',
    offersChange: '&',
    method: '=?',
    packName: '<',
  },
  controller,
  template,
};
