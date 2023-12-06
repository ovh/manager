import controller from './add-notebook.controller';
import template from './add-notebook.html';
import './add-notebook.scss';

export default {
  template,
  controller,
  bindings: {
    projectId: '<',
    capabilities: '<',
    goBack: '<',
    prices: '<',
    user: '<',
    containers: '<',
    goToAiNotebook: '<',
    goToDashboard: '<',
    goToCommand: '<',
    trackNotebooks: '<',
    isDiscoveryProject: '<',
    goToDiscoveryProjectActivationPage: '&',
  },
};
