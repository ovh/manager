import controller from './notebook-details.controller';
import template from './notebook-details.html';

export default {
  template,
  controller,
  bindings: {
    notebook: '<',
    projectId: '<',
    terminateNotebook: '<',
    showNotebook: '<',
    goBack: '<',
    openLiveCodeEditor: '<',
    capabilities: '<',
  },
};
