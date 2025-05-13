import controller from './hosting-shared-add-edit-cache-rule.controller';
import template from './hosting-shared-add-edit-cache-rule.html';

export default {
  controller,
  template,
  bindings: {
    serviceName: '<',
    domainName: '<',
    cdnOptionTypeEnum: '<',
    enableOnlyExtension: '<',
    goBack: '<',
    domain: '<',
    rule: '<',
    rules: '<',
    priority: '<',
    callbacks: '<',
    resourceTypes: '<',
    trackClick: '<',
  },
};
