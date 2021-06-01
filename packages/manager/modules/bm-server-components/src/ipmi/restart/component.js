import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    serviceName: '<',
    onCancel: '&?',
    onSuccess: '&?',
    onError: '&?',
  },
  controller,
  template,
};
