import template from './beneficiaries.html';
import controller from './beneficiaries.controller';

export default {
  template,
  controller,
  bindings: {
    beneficiaries: '=',
    representativeIsBeneficiary: '=',
    countryEnum: '<',
    editable: '<',
  },
};
