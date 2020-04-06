import controller from './logs-add-tool.controller';
import template from './logs-add-tool.html';

export default {
  bindings: {
    text: '@',
    toolType: '@',
    currentUsage: '<',
    maxUsage: '<',
    callback: '&',
  },
  controller,
  template,
};
