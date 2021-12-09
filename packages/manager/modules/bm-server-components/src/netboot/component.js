import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    server: '<',
    serviceName: '@',
    onError: '&?',
    onSuccess: '&?',
    onGoBack: '&?',
  },
  controller,
  template,
};
