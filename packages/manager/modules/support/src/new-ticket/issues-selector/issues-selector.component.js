import controller from './issues-selector.controller';
import template from './issues-selector.html';

export default {
  bindings: {
    category: '<',
    serviceType: '<',
    rank: '<',
    root: '<',
    parent: '<',
    onIssues: '&',
  },
  controller,
  name: 'supportIssuesSelector',
  template,
};
