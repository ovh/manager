import controller from './issues-form.controller';
import template from './issues-form.html';

export default {
  bindings: {
    onSubmit: '&',
    categoryName: '<?',
    serviceName: '<?',
    serviceTypeName: '<?',
  },
  controller,
  name: 'supportNewIssuesForm',
  template,
};
