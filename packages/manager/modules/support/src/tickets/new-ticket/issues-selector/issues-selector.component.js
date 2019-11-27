import controller from './issues-selector.controller';
import template from './issues-selector.html';

export default {
  bindings: {
    onChange: '&',
    category: '<',
    serviceType: '<',
    parentIssue: '<',
  },
  controller,
  name: 'supportIssuesSelector',
  template,
};
