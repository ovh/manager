import controller from './controller';
import template from './template.html';
import 'font-awesome/css/font-awesome.css';

export default {
  bindings: {
    hasInvoice: '<',
  },
  controller,
  template,
};
