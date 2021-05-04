import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    catalog: '<',
    goBack: '<',
    project: '<',
    projectId: '<',
    storageAddon: '<',
    selectedPlan: '<',
  },
  controller,
  template,
};
