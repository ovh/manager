import controller from './controller';
import template from './template.html';

export default {
  bindings: {
    server: '<',
    user: '<',
    serviceName: '@',
    displayName: '@',
    installFrom: '@',
    onError: '&?',
    onGoBack: '&?',
    installProgressHref: '<',
  },
  controller,
  template,
};

