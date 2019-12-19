import controller from './controller';
import template from './template.html';

const component = {
  bindings: {
    model: '=',
    errorCallback: '&',
  },
  controller,
  name: 'ovhPaymentMethodChoice',
  template,
};

export default component;
