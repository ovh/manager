import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    catalog: '<',
    projectId: '<',
    addon: '<',
    selectedPlan: '<',
    project: '<',
    goBack: '<',
    addonType: '<',
  },
  controller,
  template,
};
