import controller from './controller';
import template from './template.html';

const component = {
  template,
  controller,
  bindings: {
    voucher: '<',
  },
};

export default component;
