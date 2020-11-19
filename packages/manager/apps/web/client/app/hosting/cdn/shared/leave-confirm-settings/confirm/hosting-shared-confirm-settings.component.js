import controller from './hosting-shared-confirm-settings.controller';
import template from './hosting-shared-confirm-settings.html';

export default {
  controller,
  template,
  bindings: {
    goBack: '<',
    rules: '<',
    model: '<',
    success: '<',
    cancel: '<',
    trackClick: '<',
  },
};
