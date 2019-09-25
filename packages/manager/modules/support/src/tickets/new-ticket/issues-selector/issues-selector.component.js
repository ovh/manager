import controller from './issues-selector.controller';
import template from './issues-selector.html';

export default {
  bindings: {
    category: '<',
    serviceType: '<',
    parentIssue: '<',
    issue: '=',
  },
  controller,
  name: 'supportIssuesSelector',
  template,
};
