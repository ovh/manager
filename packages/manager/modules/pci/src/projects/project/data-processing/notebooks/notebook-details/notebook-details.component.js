import controller from './notebook-details.controller';
import template from './notebook-details.html';

export default {
  template,
  controller,
  bindings: {
    notebook: '<',
    projectId: '<',
    terminateNotebook: '<',
    goBack: '<',
    openLiveCodeEditor: '<',
    capabilities: '<',
  },
};
