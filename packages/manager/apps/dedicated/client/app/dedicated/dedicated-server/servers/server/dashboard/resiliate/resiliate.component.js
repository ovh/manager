import controller from './resiliate.controller';
import template from './template.html';

export default {
  bindings: {
    capabilities: '<',
    goBack: '<',
    onSuccess: '<',
    onError: '<',
    service: '<',
    serviceTypeLabel: '<',
  },
  controller,
  template,
};
