import template from './template.html';
import controller from './controller';

export default {
  controller,
  template,
  bindings: {
    proof: '<',
    proofType: '<',
    document: '<',
    documentFiles: '<',
    goBack: '&',
    addDocuments: '&',
  },
};
