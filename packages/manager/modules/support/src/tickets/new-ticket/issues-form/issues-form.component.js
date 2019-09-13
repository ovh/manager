import controller from './issues-form.controller';
import template from './issues-form.html';

export default {
  bindings: {
    onSubmit: '&',
  },
  controller,
  name: 'supportNewIssuesForm',
  template,
};
