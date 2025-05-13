import controller from './user-identity-documents.controller';
import template from './user-identity-documents.html';

export default {
  controller,
  template,
  bindings: {
    kycStatus: '<',
  },
};
