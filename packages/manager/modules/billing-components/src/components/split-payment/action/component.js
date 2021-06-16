import controller from './controller';
import template from './index.html';

export default {
  bindings: {
    action: '<',
    actionLabelKey: '<',
    errorMessageKey: '<',
    goBack: '<',
    successMessageKey: '<',
    trackClick: '<',
    trackPage: '<',
  },
  controller,
  template,
};
