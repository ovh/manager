import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    disabled: '<',
    offers: '<',
    onSelect: '&',
    previewMode: '<',
    selectedPlan: '<',
    user: '<',
  },
  controller,
  template,
};
