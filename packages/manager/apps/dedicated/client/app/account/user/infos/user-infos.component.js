import controller from './user-infos.controller';
import template from './user-infos.html';

export default {
  bindings: {
    fieldToFocus: '<',
    kycStatus: '<',
    getKycStatus: '<',
  },
  template,
  controller,
};
