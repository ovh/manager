import template from './list.html';
import controller from './list.controller';

export default {
  template,
  controller,
  bindings: {
    documents: '<',
    documentTypeEnum: '<',
    documentNatureEnum: '<',
    uploadDocument: '<',
    onDocumentChange: '&',
    update: '<',
  },
};
