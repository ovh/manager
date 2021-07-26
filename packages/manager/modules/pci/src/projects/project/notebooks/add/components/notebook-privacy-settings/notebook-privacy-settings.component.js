import controller from './notebook-privacy-settings.controller';
import template from './notebook-privacy-settings.html';

export default {
  bindings: {
    displayNotebookPrivacySettings: '<',
    notebookModel: '<',
  },
  controller,
  template,
};
