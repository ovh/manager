import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    catalog: '<',
    projectId: '<',
    storageAddon: '<',
    selectedPlan: '<',
    project: '<',
    goBack: '<',
  },
  controller,
  template,
};
