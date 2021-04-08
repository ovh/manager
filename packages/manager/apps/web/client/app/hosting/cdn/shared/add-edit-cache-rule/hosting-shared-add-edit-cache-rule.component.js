import controller from './hosting-shared-add-edit-cache-rule.controller';
import template from './hosting-shared-add-edit-cache-rule.html';

export default {
  controller,
  template,
  bindings: {
    cdnOptionTypeEnum: '<',
    goBack: '<',
    domain: '<',
    rule: '<',
    rules: '<',
    priority: '<',
    callbacks: '<',
    trackClick: '<',
  },
};
