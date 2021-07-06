import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    user: '<',
    server: '<',
    onCancel: '&?',
    onSuccess: '&?',
    onError: '&?',
    onGoBack: '&?',
  },
  controller,
  template,
};
