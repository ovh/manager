import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    addon: '<',
    addonType: '<',
    catalog: '<',
    goBack: '<',
    getOrderUrl: '<',
    project: '<',
    projectId: '<',
    selectedPlan: '<',
    user: '<',
    trackTextPrefix: '<',
  },
  controller,
  template,
};
