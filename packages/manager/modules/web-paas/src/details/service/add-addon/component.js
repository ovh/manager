import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    addon: '<',
    addonType: '<',
    catalog: '<',
    getOrdersURL: '<',
    goBack: '<',
    project: '<',
    projectId: '<',
    selectedPlan: '<',
  },
  controller,
  template,
};
